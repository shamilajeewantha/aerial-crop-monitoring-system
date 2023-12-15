from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS from flask_cors
import logging
import subprocess
import firebase_admin
from firebase_admin import firestore
import os
from firebase_admin import credentials, storage
import shutil
import time


# Initialize Flask
app = Flask(__name__)
CORS(app)


logging.basicConfig(filename='app.log', level=logging.INFO)


# Initialize Firebase
cred = credentials.Certificate("serviceAccountKey.json")  # Replace with your actual file name
firebase_admin.initialize_app(cred, {"storageBucket": "drone-images-d1a48.appspot.com"})

# Specify the Firebase Storage folder to download images from
#fb_folder = "images_2023-10-12@13-55-06"  # Replace with your folder name

# Function to download and save images from Firebase Storage
def download_images_from_firebase(folder_name):
    bucket = storage.bucket()

    # List all the blobs (files) in the specified folder
    blobs = bucket.list_blobs(prefix=folder_name)

    # Create a local directory to save the downloaded images
    local_directory = "raw_images"
    os.makedirs(local_directory, exist_ok=True)

    for blob in blobs:
        # Download each image and save it to the local directory
        blob.download_to_filename(os.path.join(local_directory, os.path.basename(blob.name)))
        print(f"Downloaded: {blob.name}")







local_upload_directory = "results"  # Replace with your local directory name
# Specify the Firebase Storage folder to upload images to
#fb_upload_folder = "images_uploads"  # Replace with your folder name

# Function to upload all images from a local directory to Firebase Storage
def upload_images_to_firebase(local_dir, firebase_dir):
    bucket = storage.bucket()

    # List all the image files in the local directory
    image_files = [f for f in os.listdir(local_dir) if os.path.isfile(os.path.join(local_dir, f))]
    
    for image_file in image_files:
        # Upload each image to the specified Firebase Storage folder 
        blob = bucket.blob(f"{firebase_dir}/{image_file}")       
        blob.upload_from_filename(os.path.join(local_dir, image_file))
        print(f"Uploaded: {image_file} to Firebase")


























""" 
# Define a route to display Firestore data
@app.route('/get', methods =[ 'GET'])
def display_farmers():
    # Retrieve data from Firestore
    users_ref = db.collection("users")
    docs = users_ref.stream()
    output = {}

    for doc in docs:
        output[doc.id] = doc.to_dict()

    return (output)
 """






@app.route('/signupst', methods=['POST'])
def signup():
    try:
        data = request.json  # Assumes the client sends JSON data
        name = data['name']
        email = data['email']
        password = data['password']

        # Log the received data
        logging.info(f"Received data - Name: {name}, Email: {email}, Password: {password}")

        # Your data processing code here

        return jsonify({"message": "Signup successful"}), 200

    except Exception as e:
        # Log the error
        logging.error(f"Error occurred during signup: {str(e)}")

        return jsonify({"error": "Error occurred during signup"}), 500





""" def get_articles():
    return jsonify({"hello": "world"}) """




@app.route('/', methods=['POST'])
def run_external_script():
    try:

        data = request.json  # Assumes the client sends JSON data
        folder_name = data['folder']
        logging.info(f"Received data - Name: {folder_name}")
        download_folder_path = f"{folder_name}/raw_images"
        # Download and save images from the specified Firebase Storage folder
        download_images_from_firebase(download_folder_path)


        result = subprocess.run(['python', 'fbdownload_unet_upload.py'], capture_output=True, text=True)

        # Upload all images from the local directory to the specified Firebase Storage folder
        fb_upload_folder=f"{folder_name}/result_images"
        upload_images_to_firebase(local_upload_directory, fb_upload_folder)


        bucket = storage.bucket()
        # Verify upload completion by checking if local files are successfully uploaded
        fb_files = [blob.name.split('/')[-1] for blob in bucket.list_blobs(prefix=fb_upload_folder)]
        local_files = [filename for filename in os.listdir(local_upload_directory)]
        logging.info(f"Received data - Name: {fb_files}")
        logging.info(f"Received data - Name: {local_files}")
        remove_cache_folder = False
        time.sleep(0)
        if all(file in fb_files for file in local_files):
            # All files are uploaded; delete local directory            
            shutil.rmtree(local_upload_directory)
            shutil.rmtree("raw_images")
            shutil.rmtree("raw_images_stitched")
            remove_cache_folder = True
        else:
            remove_cache_folder = False
            print("Upload might not be completed. Some files might not have been uploaded yet.")

        if result.returncode == 0:
            output = result.stdout
            return jsonify({'success': True, 'output': output, 'remove_cache_folder': remove_cache_folder})
        else:
            error = result.stderr
            return jsonify({'success': False, 'error': error, 'remove_cache_folder': remove_cache_folder})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})


if __name__ == "__main__":
    app.run(debug=True)
