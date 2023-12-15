import React from 'react'
import BackgroundImage from '../assets/blogbg.jpg';
import "./singlepost.css"

function SinglePost() {
  return (
    <div className='SinglePost'>
      <div className='SinglePostWrapper'>

        <img className="SinglePostImg" src={BackgroundImage} alt="BackgroundImage" />

        <h1 className="SinglePostTitle">
        Application of Drone systems in
Crop Monitoring        </h1>

        <p className='singlePostParagraph'>
        Modern agriculture faces the challenge of making 
precision agriculture accessible to all, especially smallholders 
and farmers in developing countries. This abstract explores an 
innovative solution utilizing drones equipped with RGB 
cameras for crop monitoring. The drones will perform area 
segmentation, soil composition detection, and irrigation 
problem identification, aiding in decision-making. 
Additionally, the drones will monitor crop health, detect pest 
and fungal infections. This research serves as a proof-ofconcept for small-scale autonomous geographical region 
mapping, offering a promising path towards democratizing 
precision agriculture for wider adoption.

Despite the undeniable progress made by industry leaders
like Agribotix, Parrot, DJI Agras Series, Sentera,
PrecisionHawk, senseFly, and Delair in revolutionizing
agricultural practices through drone-based crop monitoring
systems, affordability and accessibility remain significant
hurdles, particularly for resource-constrained smallholder
farmers. These systems, equipped with advanced technologies
like NDVI multispectral sensors, sophisticated data analytics,
and high-resolution imaging capabilities, empower farmers to
closely monitor crop health, promptly identify problematic
areas, and make informed decisions regarding irrigation,
fertilization, and pest management. However, the high cost of
these systems often limits their adoption by smallholder
farmers, hindering the widespread adoption of precision
agriculture. Furthermore, traditional satellite imaging
techniques face inherent limitations in accurately delineating
land compositions and distinguishing between various crops,
such as rice, wheat, and cotton. This necessitates a
reevaluation of our approach to land segmentation and crop
type differentiation. This proposed crop monitoring system
tackles these challenges with a simplified yet powerful
approach. Leveraging an affordable RGB camera, robust
index algorithms, advanced computer vision techniques, and
the cost-effective infrastructure of cloud computing services,
this solution prioritizes affordability and directly addresses
these persistent limitations.


A low-cost drone was equipped with a Raspberry Pi 4 and
a camera module (Raspberry Pi Camera Module V2) to
capture images of agricultural fields. A luminosity module
(Adafruit TSL2561 Light Sensor Breakout Board) was also attached to the drone to measure the ambient light conditions.
The drone was programmed to fly autonomously over a
designated field, taking images at regular intervals. The
images were then processed using Python scripts to extract
information about the field and its crops.


The proposed drone-based crop monitoring system
employs a cost-effective and efficient communication
architecture to seamlessly transfer captured images to cloud
storage and process them using cloud-based computer vision
algorithms. This architecture leverages the ubiquitous
availability of 3G/4G cellular networks to ensure
uninterrupted data transmission, even in remote areas. By
utilizing cloud services for image processing and analysis, the
system eliminates the need for expensive and power-hungry
hardware on the drone itself. A low-power computing module,
Raspberry Pi 4 is employed, significantly reducing costs and
extending battery life instead of powerful modules like
NVIDIA Jetson series computers. Further, the cloud-based
architecture is highly scalable and can accommodate a
growing number of drones and fields, enabling widespread
adoption. Upon reaching the cloud storage service, the images
are retrieved by a cloud-based server hosting the computer
vision algorithms. These algorithms perform image analysis
tasks, such as vegetation segmentation, crop health
assessment, and pest detection, extracting valuable insights
from the captured data. The processed image data and
extracted insights are then stored in the cloud, accessible to
farmers through web and mobile applications. Farmers can
remotely access these applications to view detailed crop health
maps, identify potential problems, and make informed
decisions regarding irrigation, fertilization, and pest control.

The system employs Firebase Storage and Firestore,
cloud-based services that offer scalability, durability, and ease
of integration with Google Cloud hosted computer vision
algorithms. Firebase also simplifies image uploading from the
Raspberry Pi 4, minimizing computational requirements, and
enabling minor preprocessing tasks.

U-Net, a convolutional neural network (CNN) architecture
specifically designed for biomedical and satellite image
segmentation.
U-Net's unique architecture, characterized by its encoderdecoder structure and skip connections, allows for precise and
accurate segmentation of complex images, such as those
captured by drones. The encoder extracts features from the
input image, gradually reducing its size while increasing the
number of feature channels. Conversely, the decoder
gradually upsamples the feature maps, combining them with
corresponding high-resolution feature maps from the encoder,
enabling precise localization of features. This architecture
enables U-Net to effectively segment agricultural fields into
distinct areas based on vegetation levels, land composition and
soil variation.

The detection of deformed leaves is a critical task for plant
infection identification and treatment. To address this
challenge, a two-fold approach has proven effective,
employing image classification with the VGG model and
object detection with Faster R-CNN. The VGG model is
employed for image classification, enabling the identification
of deformed leaves at the image level. This initial
categorization provides a broad assessment of the presence of
leaf deformities. Simultaneously, the Faster R-CNN model
takes the analysis further, performing object detection to
delineate the precise location and extent of individual
deformed leaves within the image. The combination of image
classification and object detection delivers a comprehensive
understanding of leaf health, facilitating the targeted
management of deformed leaves, disease identificat
        </p>

      </div>
    </div>
  )
}

export default SinglePost