import React, { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import {
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";


const containerStyles = {
    position: "absolute",
    left: "50%", // Center horizontally
    transform: "translateX(-50%)", // Center horizontally
  };
  
  const buttonStyles = {
    marginRight: "10px", // Add margin to create a gap between buttons
  };

function ImageContainer({imageUrls}) {

    const Controls = ({ zoomIn, zoomOut, resetTransform }) => (
        <>
          <Button
            className={"btn btn-primary"}
            onClick={() => zoomIn()}
            style={buttonStyles}
          >
            Zoom In
          </Button>
          <Button
            className={"btn btn-primary"}
            onClick={() => zoomOut()}
            style={buttonStyles}
          >
            Zoom Out
          </Button>
          <Button
            className={"btn btn-primary"}
            onClick={() => resetTransform()}
          >
            Reset
          </Button>
        </>
      );
      

      // Create a list of images with the desired format
      const images = imageUrls.map((url, index) => ({
        id: index + 1,
        src: url,
        alt: `Image ${index + 1}`,
      }));
    

      const transformComponentRef = useRef(null);
      const [currentImage, setCurrentImage] = useState(images[0]); // Initially, display the first image
    
      const zoomToImage = (image) => {
        if (transformComponentRef.current) {
          const { zoomToElement } = transformComponentRef.current;
          setCurrentImage(image); // Set the current image to the clicked image
          zoomToElement(`img${image.id}`);
        }
      };
    
      return (
        <div style={containerStyles}>
                <div>
            {images.map((image) => (
              <Button
                key={image.id}
                variant="primary"
                onClick={() => zoomToImage(image)}
                style={buttonStyles}
              >
                Zoom In on {image.alt}
              </Button>
            ))}
          </div>
          {/* Rest of your component */}
          <TransformWrapper
            initialScale={1}
            ref={transformComponentRef}
          >
            {(utils) => (
              <React.Fragment>
                <Controls {...utils} />
                <TransformComponent>
                <img
                    src={currentImage.src}
                    alt={currentImage.alt}
                    id={`img${currentImage.id}`}
                  />            </TransformComponent>
              </React.Fragment>
            )}
          </TransformWrapper>
        </div>
      );
}

export default ImageContainer










