from stitching import Stitcher
import glob
import cv2
import os

raw_images_stitched = "raw_images_stitched"  
os.makedirs(raw_images_stitched, exist_ok=True)

# Create a Stitcher instance with custom settings
stitcher = Stitcher(detector="sift", confidence_threshold=0.2)

# Get a list of image files in the folder
image_files = glob.glob("./raw_images/*.jpg")

# Stitch the images
panorama = stitcher.stitch(image_files)

# Save or display the resulting panorama
cv2.imwrite("./raw_images_stitched/stitched.jpg", panorama)