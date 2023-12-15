import firebase_admin
from firebase_admin import credentials, storage
from firebase_admin import db
from firebase_admin import firestore
import time
import cv2
import threading

# Fetch the service account key JSON file contents
cred = credentials.Certificate("serviceAccountKey.json")  # Replace with your actual file name

firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://drone-images-d1a48-default-rtdb.firebaseio.com',
    'storageBucket': 'drone-images-d1a48.appspot.com'
})

dbf = firestore.client()
firestoreSet = False


# Create a reference to the database location you want to listen to
ref = db.reference('droneData')
ref1 = db.reference('folderData')
bucket = storage.bucket()
fb_folder_timestamp = time.strftime("%Y-%m-%d@%H-%M-%S", time.localtime(time.time()))
fb_folder_name =f"images_{fb_folder_timestamp}"
fb_folder_path = f"images_{fb_folder_timestamp}/raw_images/"




condition = threading.Condition()
capture_images = False

# Function 1 will start and stop based on the condition
def function1():
    global capture_images
    while True:
        with condition:
            while not capture_images:
                condition.wait()
            print("Function 1 is running")
            capture_image()
        time.sleep(1)

# Function to capture an image from the webcam
def capture_image():
    current_time = time.strftime("%H_%M_%S", time.localtime(time.time()))
    image_name = f"image_{current_time}.jpg"
    # Use OpenCV to capture an image from the webcam
    """ camera = cv2.VideoCapture(0)  # Use 0 for the default webcam
    ret, frame = camera.read()
    if ret:
        cv2.imwrite(image_name, frame)
        print("Image captured:", image_name)
        upload_image(image_name)
        print("Image uploaded:", image_name)
    else:
        print("Error capturing image")
    camera.release() """
    
    upload_image("IMG1.jpg")


# Function to upload an image to Firebase Storage
def upload_image(file_name):

    blob = bucket.blob(f"{fb_folder_path}{file_name}")
    try:
        blob.upload_from_filename(file_name)
        print("Image uploaded to Firebase:", blob.public_url)
    except Exception as e:
        print("Error uploading image:", e)



# Define a callback function to handle changes
def on_snapshot(event):
    global capture_images
    global firestoreSet
    global ref1
    event_type = event.event_type
    event_path = event.path
    event_data = event.data

    if event_type == 'put':
        print(f"Data at path {event_path} was added or changed: {event_data}")
        print(event_data['capture'], event_data['farmName'])

        if event_data['capture'] == True:
            print("Capture is true, start capturing images.")

            with condition:
                capture_images = True
                condition.notify()

            if (firestoreSet == False):
                farm_ref = dbf.collection(event_data['farmerID']).document(event_data['farmName'])
                farm_ref.update({"result_image_folders": firestore.ArrayUnion([fb_folder_name])}) 
                firestoreSet = True
                ref1.set({'folder': fb_folder_name})               
                

        else:
            print("Capture is false, stop capturing images.")
            with condition:
                capture_images = False

    elif event_type == 'patch':
        print(f"Data at path {event_path} was updated: {event_data}")
    elif event_type == 'delete':
        print(f"Data at path {event_path} was deleted")

# Listen for changes
ref.listen(on_snapshot)

# Create and start thread1
thread1 = threading.Thread(target=function1)
thread1.start()

# Main thread continues to listen for Firebase changes
try:
    while True:
        pass
except KeyboardInterrupt:
    capture_images = False  # Stop capturing on keyboard interrupt

# Clean up and close
input("Press Enter to stop the script...")
