import React, { useEffect, useState } from 'react';
import { getStorage, ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import ImageContainer from './ImageContainer';

function ImageGallery({ folderName }) {
  const [imageUrls, setImageUrls] = useState([]);
  const [imageNames, setImageNames] = useState([]);

  useEffect(() => {
    const storage = getStorage();
    const folderRef = ref(storage, folderName); // Use the folderName prop

    listAll(folderRef)
      .then((res) => {
        const urls = [];
        const names = [];

        // Loop through each item in the folder
        res.items.forEach((item, index) => {
          getDownloadURL(item)
            .then((url) => {
              urls.push(url);

              // Get metadata for each item to retrieve the name
              getMetadata(item)
                .then((metadata) => {
                  names.push(metadata.name);

                  // If we have collected all URLs and names, update the state
                  if (urls.length === res.items.length && names.length === res.items.length) {
                    setImageUrls(urls);
                    setImageNames(names);
                  }
                })
                .catch((error) => {
                  console.error('Error getting metadata:', error);
                });
            })
            .catch((error) => {
              console.error('Error getting download URL:', error);
            });
        });
      })
      .catch((error) => {
        // Handle errors here
        console.error('Error listing folder items:', error);
      });
  }, [folderName]);

  return (
    <div>
      <h1>Image Gallery</h1>
      <div className="image-container">
        {imageUrls.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <>
            <ImageContainer imageUrls={imageUrls} />
            <div>
              {imageNames.map((name) => {
                const parts = name.split('_');
                if (parts.length === 2 && parts[0] === 'mask') {
                  const percentage = parts[1].split('.')[0]+"."+parts[1].split('.')[1];
                  return <p key={name}>Green Percentage: {percentage}%</p>;
                }
                return null;
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ImageGallery;
