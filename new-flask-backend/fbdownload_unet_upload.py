













import subprocess
import os
import cv2
import numpy as np
import matplotlib.pyplot as plt
from tqdm.notebook import tqdm
from random import shuffle
import torch
from torch import nn
from glob import glob
import torch.nn as nn
import torch.nn.functional as F
from torch.autograd import Variable
import torch.utils.data
import torchvision.transforms as transforms


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


class segDataset(torch.utils.data.Dataset):
    def __init__(self, root, training, transform=None):
        super(segDataset, self).__init__()
        self.root = root
        self.training = training
        self.transform = transform
        self.IMG_NAMES = sorted(glob(self.root + '/*.jpg'))
        self.BGR_classes = {'Water' : [ 41, 169, 226],
                            'Land' : [246,  41, 132],
                            'Road' : [228, 193, 110],
                            'Building' : [152,  16,  60],
                            'Vegetation' : [ 58, 221, 254],
                            'Unlabeled' : [155, 155, 155]} # in BGR

        self.bin_classes = ['Water', 'Land', 'Road', 'Building', 'Vegetation', 'Unlabeled']


    def __getitem__(self, idx):
        img_path = self.IMG_NAMES[idx]
        

        image = cv2.imread(img_path)
        
        



        image = cv2.resize(image, (512,512))/255.0
        
        image = np.moveaxis(image, -1, 0)

        return torch.tensor(image).float()


    def __len__(self):
        return len(self.IMG_NAMES)
    

color_shift = transforms.ColorJitter(.1,.1,.1,.1)
blurriness = transforms.GaussianBlur(3, sigma=(0.1, 2.0))

t = transforms.Compose([color_shift, blurriness])






class DoubleConv(nn.Module):
    """(convolution => [BN] => ReLU) * 2"""

    def __init__(self, in_channels, out_channels, mid_channels=None):
        super().__init__()
        if not mid_channels:
            mid_channels = out_channels
        self.double_conv = nn.Sequential(
            nn.Conv2d(in_channels, mid_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(mid_channels),
            nn.ReLU(inplace=True),
            nn.Conv2d(mid_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True)
        )

    def forward(self, x):
        return self.double_conv(x)






class Down(nn.Module):
    """Downscaling with maxpool then double conv"""

    def __init__(self, in_channels, out_channels):
        super().__init__()
        self.maxpool_conv = nn.Sequential(
            nn.MaxPool2d(2),
            DoubleConv(in_channels, out_channels)
        )

    def forward(self, x):
        return self.maxpool_conv(x)


class Up(nn.Module):
    """Upscaling then double conv"""

    def __init__(self, in_channels, out_channels, bilinear=True):
        super().__init__()

        # if bilinear, use the normal convolutions to reduce the number of channels
        if bilinear:
            self.up = nn.Upsample(scale_factor=2, mode='bilinear', align_corners=True)
            self.conv = DoubleConv(in_channels, out_channels, in_channels // 2)
        else:
            self.up = nn.ConvTranspose2d(in_channels , in_channels // 2, kernel_size=2, stride=2)
            self.conv = DoubleConv(in_channels, out_channels)


    def forward(self, x1, x2):
        x1 = self.up(x1)
        # input is CHW
        diffY = x2.size()[2] - x1.size()[2]
        diffX = x2.size()[3] - x1.size()[3]

        x1 = F.pad(x1, [diffX // 2, diffX - diffX // 2,
                        diffY // 2, diffY - diffY // 2])
        x = torch.cat([x2, x1], dim=1)
        return self.conv(x)


class OutConv(nn.Module):
    def __init__(self, in_channels, out_channels):
        super(OutConv, self).__init__()
        self.conv = nn.Conv2d(in_channels, out_channels, kernel_size=1)

    def forward(self, x):
        return self.conv(x)
    







class UNet(nn.Module):
    def __init__(self, n_channels, n_classes, bilinear=True):
        super(UNet, self).__init__()
        self.n_channels = n_channels
        self.n_classes = n_classes
        self.bilinear = bilinear

        self.inc = DoubleConv(n_channels, 64)
        self.down1 = Down(64, 128)
        self.down2 = Down(128, 256)
        self.down3 = Down(256, 512)
        factor = 2 if bilinear else 1
        self.down4 = Down(512, 1024 // factor)
        self.up1 = Up(1024, 512 // factor, bilinear)
        self.up2 = Up(512, 256 // factor, bilinear)
        self.up3 = Up(256, 128 // factor, bilinear)
        self.up4 = Up(128, 64, bilinear)
        self.outc = OutConv(64, n_classes)

    def forward(self, x):
        x1 = self.inc(x)
        x2 = self.down1(x1)
        x3 = self.down2(x2)
        x4 = self.down3(x3)
        x5 = self.down4(x4)
        x = self.up1(x5, x4)
        x = self.up2(x, x3)
        x = self.up3(x, x2)
        x = self.up4(x, x1)
        logits = self.outc(x)
        return logits
    







class FocalLoss(nn.Module):
    def __init__(self, gamma=0, alpha=None, size_average=True):
        super(FocalLoss, self).__init__()
        self.gamma = gamma
        self.alpha = alpha
        if isinstance(alpha,(float,int)): self.alpha = torch.Tensor([alpha,1-alpha])
        if isinstance(alpha,list): self.alpha = torch.Tensor(alpha)
        self.size_average = size_average

    def forward(self, input, target):
        if input.dim()>2:
            input = input.view(input.size(0),input.size(1),-1)  # N,C,H,W => N,C,H*W
            input = input.transpose(1,2)    # N,C,H*W => N,H*W,C
            input = input.contiguous().view(-1,input.size(2))   # N,H*W,C => N*H*W,C
        target = target.view(-1,1)

        logpt = F.log_softmax(input, dim=-1)
        logpt = logpt.gather(1,target)
        logpt = logpt.view(-1)
        pt = Variable(logpt.data.exp())

        if self.alpha is not None:
            if self.alpha.type()!=input.data.type():
                self.alpha = self.alpha.type_as(input.data)
            at = self.alpha.gather(0,target.data.view(-1))
            logpt = logpt * Variable(at)

        loss = -1 * (1-pt)**self.gamma * logpt
        if self.size_average: return loss.mean()
        else: return loss.sum()



criterion = FocalLoss(gamma=3/4).to(device)

class mIoULoss(nn.Module):
    def __init__(self, weight=None, size_average=True, n_classes=2):
        super(mIoULoss, self).__init__()
        self.classes = n_classes

    def to_one_hot(self, tensor):
        n,h,w = tensor.size()
        one_hot = torch.zeros(n,self.classes,h,w).to(tensor.device).scatter_(1,tensor.view(n,1,h,w),1)
        return one_hot

    def forward(self, inputs, target):
        # inputs => N x Classes x H x W
        # target_oneHot => N x Classes x H x W

        N = inputs.size()[0]

        # predicted probabilities for each pixel along channel
        inputs = F.softmax(inputs,dim=1)

        # Numerator Product
        target_oneHot = self.to_one_hot(target)
        inter = inputs * target_oneHot
        ## Sum over all pixels N x C x H x W => N x C
        inter = inter.view(N,self.classes,-1).sum(2)

        #Denominator
        union= inputs + target_oneHot - (inputs*target_oneHot)
        ## Sum over all pixels N x C x H x W => N x C
        union = union.view(N,self.classes,-1).sum(2)

        loss = inter/union

        ## Return average loss over classes and batch
        return 1-loss.mean()


criterion = mIoULoss(n_classes=6).to(device)

def acc(label, predicted):
    seg_acc = (y.cpu() == torch.argmax(pred_mask, axis=1).cpu()).sum() / torch.numel(y.cpu())
    return seg_acc

min_loss = torch.tensor(float('inf'))

model = UNet(n_channels=3, n_classes=6, bilinear=True).to(device)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
lr_scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=1, gamma=0.5)













if __name__ == '__main__':



    result = subprocess.run(['python', 'stitch.py'], capture_output=True, text=True)


    dataset = segDataset('./raw_images_stitched', training = False, transform= t)

    len(dataset)

    #plot one item
    #d = dataset[1]
    #plt.figure(figsize=(15,15))
    #plt.subplot(1,2,1)
    #plt.imshow(np.moveaxis(d[0].numpy(),0,-1))
    #plt.subplot(1,2,2)
    #plt.imshow(d[1].numpy())
    # Display the plots
    #plt.show()

    print("over")

    test_num = int(1 * len(dataset))
    print(f'test data : {test_num}')
    train_dataset, test_dataset = torch.utils.data.random_split(dataset, [len(dataset)-test_num, test_num], generator=torch.Generator().manual_seed(101))

    BACH_SIZE = 4
    #train_dataloader = torch.utils.data.DataLoader(
        #train_dataset, batch_size=BACH_SIZE, shuffle=True, num_workers=1)

    test_dataloader = torch.utils.data.DataLoader(
        test_dataset, batch_size=BACH_SIZE, shuffle=False, num_workers=1)


    model.load_state_dict(torch.load('unet_epoch_90_0.63296.pt'))


    model.eval()

    class_to_bgr = {
    0: [41, 169, 226],    # Water
    1: [246, 41, 132],    # Land
    2: [228, 193, 110],   # Road
    3: [152, 16, 60],     # Building
    4: [58, 221, 254],    # Vegetation
    5: [155, 155, 155]    # Unlabeled
    }

    # Create a local directory to save the downloaded images
    local_upload_directory = "results"
    os.makedirs(local_upload_directory, exist_ok=True)

    # Initialize counters for each class
    class_pixel_counts = {class_index: 0 for class_index in class_to_bgr}


    for batch_i, (x) in enumerate(test_dataloader):
        print(len(x))
        for j in range(len(x)):
            result = model(x.to(device)[j:j+1])
            mask = torch.argmax(result, axis=1).cpu().detach().numpy()[0]
            im = np.moveaxis(x.to(device)[j].cpu().detach().numpy(), 0, -1).copy()*255
            im = im.astype(int)
            #gt_mask = y[j]

            # Convert class indices to BGR colors
            colored_mask = np.zeros((mask.shape[0], mask.shape[1], 3), dtype=np.uint8)
            for class_index, bgr_color in class_to_bgr.items():
                colored_mask[mask == class_index] = bgr_color




            # Count pixels for each class in the mask
            for class_index in class_to_bgr:
                class_pixel_counts[class_index] += np.sum(mask == class_index)

            # Calculate the percentage of vegetation pixels
            vegetation_pixels = class_pixel_counts[4] + class_pixel_counts[0]
            total_pixels = sum(class_pixel_counts.values())
            vegetation_percentage = (vegetation_pixels / total_pixels) * 100

            print(f"Percentage of vegetation pixels: {vegetation_percentage:.2f}%")
            
            # Save the colored mask as a JPG file
            cv2.imwrite(f'./results/mask_{vegetation_percentage:.3f}.jpg', colored_mask)

            plt.figure(figsize=(12,12))

            plt.subplot(1,3,1)
            im = np.moveaxis(x.to(device)[j].cpu().detach().numpy(), 0, -1).copy()*255
            im = im.astype(int)
            plt.imshow(im)
            cv2.imwrite(f'./results/image.jpg', im)

            #plt.subplot(1,3,2)
            #plt.imshow(gt_mask)

            plt.subplot(1,3,3)
            plt.imshow(mask)
            #plt.show()


