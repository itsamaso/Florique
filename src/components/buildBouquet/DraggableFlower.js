import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableFlower = ({ id, imagepath, style,onSelect,rotation,price,typeId  }) => {
  const [{ isDragging }, drag] = useDrag({
      type: 'flower',
      item: { id, imagepath,typeId },
      collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
      }),
  });

  return (
      <div ref={drag}            style={{ ...style, opacity: isDragging ? 0.5 : 1, cursor: 'move', transform: `rotate(${rotation}deg)` }} // Apply rotation here
      onClick={() => onSelect(id,typeId)}
      >
          <img src={imagepath} alt={`Flower ${id}`} style={{ height: '50%' }} />
      </div>
  );
};


export default DraggableFlower;
