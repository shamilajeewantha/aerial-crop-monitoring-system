import React from 'react'
import ImageGallery from '../components/ImageGallery';
import { useLocation } from 'react-router-dom';

function ImageViewerPage() {

    const location = useLocation();
    const state = location.state;
  
    // Access the state properties
    const imageFolder = state.imageFolder;



  return (
    <div><ImageGallery folderName={imageFolder+"/result_images"} /></div>
)
}

export default ImageViewerPage