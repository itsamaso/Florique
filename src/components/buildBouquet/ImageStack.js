import {Box,Container,Paper} from '@mui/material';

import React, { useState, useCallback,useRef,useEffect } from 'react';
import { useDrop ,useDrag} from 'react-dnd';

import DraggableFlower from './DraggableFlower';
import WrapperSelection from './WrapperSelection';
import { useParams } from 'react-router-dom';


import {  IconButton,Button } from '@mui/material';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import DeleteIcon from '@mui/icons-material/Delete';
import html2canvas from 'html2canvas';
import { fetchFlowersForShopOwner } from '../../Services/clientService';
import { postFlowersToFirebase } from '../../Services/clientService';
import FlowerSelection from './FlowerSelection';
import { useNavigate } from 'react-router-dom';
const ImageStack = () => {
    const { id } = useParams();
    const [flowers, setFlowers] = useState([]);
    const [selectedFlower, setSelectedFlower] = useState(null);
    const [flowerCounts, setFlowerCounts] = useState({});
    const navigate = useNavigate();
    const flowerIdRef = useRef(0); // This ref will keep track of the unique ID counter
    const [bottomImageZIndex, setBottomImageZIndex] = useState(3); // Initial zIndex for the bottom image
    const toggleBottomImageZIndex = () => {
        setBottomImageZIndex((currentZIndex) => (currentZIndex === 1 ? 3 : 1));
    };
    const handleSubmit = async () => {
        try {
            // Capture the image first
            const capturedImage = await captureWrapperAndFlowers();
            
            // Aggregate flower data
            const aggregatedFlowerData = flowers.reduce((acc, flower) => {
                if (!acc[flower.typeId]) {
                    acc[flower.typeId] = {
                        typeId: flower.typeId,
                        count: flowerCounts[flower.typeId],
                        price: flowerData.find(f => f.id === flower.typeId).price,
                    };
                }
                return acc;
            }, {});
            
            // Convert the aggregated data object back into an array
            const flowersToPost = Object.values(aggregatedFlowerData);
            const shopId = id; // Assuming `id` is the shop ID from `useParams`
            const wrapperToPost = selectedWrapper; // Assuming `selectedWrapper` is correctly defined elsewhere
    
            // Include the captured image in your submission
            await postFlowersToFirebase(flowersToPost, wrapperToPost, shopId, capturedImage);
            alert("Order submitted successfully!");
            navigate('/shops');
        } catch (error) {
            console.error("Failed to submit flowers and wrapper: ", error);
        }
    };
    

    
    const topWrapperRef = useRef(null); // This is used for both dropping flowers and capturing the image
    const captureWrapperAndFlowers = () => {
        return new Promise((resolve, reject) => {
            if (topWrapperRef.current) {
                html2canvas(topWrapperRef.current, { scale: 1 }).then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    resolve(imgData); // Resolve the promise with the image data URL
                }).catch(reject);
            } else {
                reject(new Error("No wrapper reference found"));
            }
        });
    };
    
    const rotateFlower = useCallback((id, angle) => {
      setFlowers(currentFlowers => currentFlowers.map(flower => {
          if (flower.id === id) {
              return { ...flower, rotation: flower.rotation + angle };
          }
          return flower;
      }));
  }, [setFlowers]);
  
  const deleteFlower = useCallback((flowerId) => {
    // Find the flower object to access its typeId
    const flowerToDelete = flowers.find(flower => flower.id === flowerId);
    if (!flowerToDelete) return; // If the flower isn't found, exit the function

    // Filter out the flower to delete
    setFlowers(currentFlowers => currentFlowers.filter(flower => flower.id !== flowerId));
    setSelectedFlower(null); // Deselect flower after deletion

    // Decrement the count for the deleted flower's typeId
    if (flowerCounts[flowerToDelete.typeId]) {
        setFlowerCounts(flowerCounts => ({
            ...flowerCounts,
            [flowerToDelete.typeId]: Math.max(0, flowerCounts[flowerToDelete.typeId] - 1) // Ensure the count doesn't go below 0
        }));
    }
}, [flowers, setFlowers, flowerCounts]);
  
    const [wrappers, setWrappers] = useState([
        { id: 'wrapper-1', name: 'Wrapper 1', topImage: '/Wrapper1Top.svg', bottomImage: '/Wrapper1Bot.svg', fullImage:'/Wrapper1.svg',type:'wrapper'},
        { id: 'wrapper-2', name: 'Wrapper 2', topImage: '/Wrapper2Top.svg', bottomImage: '/Wrapper2Bot.svg', fullImage:'/Wrapper2.svg' ,type:'wrapper'},
        { id: 'wrapper-3', name: 'Wrapper 3', topImage: '/Wrapper3Top.svg', bottomImage: '/Wrapper3Bot.svg',fullImage:'/Wrapper3.svg',type:'wrapper' },
        { id: 'wrapper-4', name: 'Wrapper 4', topImage: '/Wrapper4Top.svg', bottomImage: '/Wrapper4Bot.svg',fullImage:'/Wrapper4.svg',type:'wrapper'},
        { id: 'wrapper-5', name: 'Wrapper 5', topImage: '/Wrapper5Top.svg', bottomImage: '/Wrapper5Bot.svg',fullImage:'/Wrapper5.svg',type:'wrapper' },
      ]);
      const selectWrapper = (id) => {
        setSelectedWrapper(id);
      };
      
      const [selectedWrapper, setSelectedWrapper] = useState(null);
    
      
    // Adjust useDrop to apply to the top wrapper
    const [, drop] = useDrop({
        accept: 'flower',
        drop: (item, monitor) => {
            if (!selectedWrapper || Object.keys(selectedWrapper).length === 0) {
                // If no wrapper is selected, alert the user and exit the function
                alert("Please select a wrapper before adding flowers.");
                return;
              }
            const clientOffset = monitor.getClientOffset();
            if (clientOffset && topWrapperRef.current) {
                const dropTargetRect = topWrapperRef.current.getBoundingClientRect();
                const x = clientOffset.x -  dropTargetRect.left;
                const y = clientOffset.y -  dropTargetRect.top;
           
            
                
                // Correctly use imagepath from item
                setFlowerCounts(flowerCounts => ({ ...flowerCounts, [item.id]: (flowerCounts[item.id] ||0 ) + 1 }));
                console.log(flowerCounts);
                addFlower(item.id, item.imagepath, x, y);
            }
        },
    });
    
    
    // Attach the drop functionality to the top wrapper ref
    drop(topWrapperRef);

    const addFlower = useCallback((typeId, imagepath, x, y) => {
        const uniqueId = `flower-${typeId}-${flowerIdRef.current++}`;
        setFlowers(currentFlowers => [...currentFlowers, { id: uniqueId, typeId, x, y, imagepath, rotation: 0 }]);
    }, [setFlowers]);



    const flowerData = [
      { id: 'flower-1', imagepath: '/1.svg',price : '10' },
      { id: 'flower-2', imagepath: '/2.svg',price : '20' },
      { id: 'flower-3', imagepath: '/3.svg',price : '30' },
      { id: 'flower-4', imagepath: '/4.svg' ,price : '40'},
        { id: 'flower-5', imagepath: '/5.svg' ,price : '50'},
        { id: 'flower-6', imagepath: '/6.svg' ,price : '60'},
        { id: 'flower-7', imagepath: '/7.svg' ,price : '70'},

      // Add more flowers as needed
  ];

    

  return (
    <Box sx={{
        display: 'flex',
        flexDirection: 'row', // Align children horizontally
        justifyContent: 'flex-start', // Align children to the start of the container
        alignItems: 'flex-start', // Align items to the top of the container
        height: '100vh',
        overflow: 'hidden', // Prevent overflow
        backgroundImage: 'url("/5474044.jpg")', // Add your image path here
        backgroundSize: 'cover', // Cover the entire box area
        backgroundPosition: 'center', // Center the background image
      }}>
   
        <Paper elevation={3} sx={{ 
          width: 350, // Fixed width for the wrapper selection
          height: 'auto', 
     
           
          padding: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}>
                    {<WrapperSelection wrappers={wrappers} onSelectWrapper={selectWrapper}  flowers={flowerData}
          
            flowerCounts={flowerCounts}
          />}


      </Paper>
            
      <Box sx={{
        position: 'absolute',
        top: 0, // Position at the top
        left: '50%',
        transform: 'translateX(-50%)', // Center horizontally
        zIndex: 10, // Ensure it's above other content
        display: 'flex',
        flexDirection: 'column', // Stack buttons vertically
        gap: 2, // Add some space between buttons
        mb: 10, // Add some margin at the bottom
  }}>
    <Button variant="contained" color="primary" onClick={handleSubmit}>Submit Order</Button>
    <Button variant="contained" color="primary" onClick={toggleBottomImageZIndex}>Toggle Bottom Image Z-Index</Button>
  </Box>
        
      <Box ref={topWrapperRef}  sx={{
                position: 'relative',
            
                height: 460,
                width: 165*2,
                background: 'rgba(255, 255, 255, 0.8)', // Add a semi-transparent white background
                margin: 'auto',
                mt: 15,
                borderRadius: '10px',
                boxShadow: '5px 5px 20px rgba(0, 0, 0, 0.2)',

            }}>

                   
              {flowers.map((flower, index) => {
    // Assuming the drop area dimensions are known and fixed: 300x470
    const dropAreaCenterX = 100;
    const dropAreaCenterY = 0;
                console.log(flower);
    // Calculate the position of the flower relative to the center
    const relativeX = flower.x - dropAreaCenterX;
    const relativeY = flower.y - dropAreaCenterY;

    // Simple angle calculation: rotate flowers based on their x position relative to the center
    // This is a very simplified rotation logic for demonstration
    let angle = relativeX < 0 ? -5 : 5; // Rotate -10deg if left of center, 10deg if right of center

    return (
      <DraggableFlower
          key={index}
          id={flower.id}
          imagepath={flower.imagepath}
          onSelect={(id,typeId) => setSelectedFlower(id,typeId)}
          typeId={flower.typeId}
          rotation={flower.rotation}
          style={{
            position: 'absolute',
            left: `${flower.x}px`,
            top: `${flower.y}px`,
            transform: `rotate(${flower.rotation}deg)`,
            zIndex: selectedFlower === flower.id ? 999 : 2,
        }}
        
      />
  );
})}
        {selectedFlower && (
            <Box
                sx={{
                    position: 'absolute',
                    left: `${flowers.find(f => f.id === selectedFlower).x}px`,
                    top: `${flowers.find(f => f.id === selectedFlower).y - 50}px`, // Adjust as necessary
                    zIndex: 5,
                    display: 'flex',
                    flexDirection: 'row', // Stack icon buttons vertically
                    '& > *': {
                    
                    },
                }}
            >
                <IconButton color="info" onClick={() => rotateFlower(selectedFlower, -5)} aria-label="rotate left">
                    <RotateLeftIcon />
                </IconButton>
                <IconButton color="info" onClick={() => rotateFlower(selectedFlower, 5)} aria-label="rotate right">
                    <RotateRightIcon />
                </IconButton>
                <IconButton color="warning" onClick={() => deleteFlower(selectedFlower)} aria-label="delete">
                    <DeleteIcon />
                </IconButton>
            </Box>
        )}
        
        {selectedWrapper && (
            
            <Box   sx={{
        
                height: 460,
                width: 330,
                
                borderRadius: '10px',
                boxShadow: '5px 5px 20px rgba(0, 0, 0, 0.2)',
                position: 'relative',
            
            
                
            

            
            
            }}>
                
            

            {/* Top image */}
            <img src={wrappers.find(w => w.id === selectedWrapper)?.topImage} alt="Wrapper Top" style={{ position: 'absolute', zIndex: 1, top: 0, width: '100%', height: '100%' }} />

        {/* Bottom image with dynamic zIndex */}
        <img src={wrappers.find(w => w.id === selectedWrapper)?.bottomImage} alt="Wrapper Bottom" style={{ position: 'absolute', zIndex: bottomImageZIndex, bottom: 0, width: '100%', height: '100%', opacity: 0.7 }} />



            </Box>
                )}     
         </Box>
         <Paper elevation={3} sx={{ 
          width: 350, // Fixed width for the wrapper selection
          height: 'auto', 
     
           
          padding: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}>

  <FlowerSelection flowers={flowerData} flowerCounts={flowerCounts} />
  </Paper>
    </Box>
  );
};

export default ImageStack;
