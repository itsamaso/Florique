// useFlowerManagement.js
import { useCallback, useState, useRef } from 'react';

export const useFlowerManagement = () => {
  const [flowers, setFlowers] = useState([]);
  const [selectedFlower, setSelectedFlower] = useState(null);
  const [flowerCounts, setFlowerCounts] = useState({});
  const flowerIdRef = useRef(0);

  const rotateFlower = useCallback((id, angle) => {
    setFlowers(currentFlowers =>
      currentFlowers.map(flower => {
        if (flower.id === id) {
          return { ...flower, rotation: flower.rotation + angle };
        }
        return flower;
      })
    );
  }, []);

  const deleteFlower = useCallback((id) => {
    setFlowers(currentFlowers => currentFlowers.filter(flower => flower.id !== id));
    setSelectedFlower(null); // Deselect flower after deletion
  }, []);

  const addFlower = useCallback((typeId, imagepath, x, y) => {
    const uniqueId = `flower-${typeId}-${flowerIdRef.current++}`;
    setFlowers(currentFlowers => [
      ...currentFlowers,
      { id: uniqueId, typeId, x, y, imagepath, rotation: 0 },
    ]);
  }, []);

  return {
    flowers,
    setFlowers,
    selectedFlower,
    setSelectedFlower,
    rotateFlower,
    deleteFlower,
    addFlower,
    flowerCounts,
    setFlowerCounts,
  };
};
