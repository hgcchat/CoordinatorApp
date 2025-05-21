import React, { useState, useEffect } from 'react';
import { Stage, Layer, Circle, Text, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';

interface Marker {
  x: number;
  y: number;
  label: string;
}

const imageOptions = ['blueprint.jpg', 'blueprint2.jpg', 'blueprint3.png'];

const BlueprintCanvas = () => {
  const [selectedImage, setSelectedImage] = useState(imageOptions[0]);
  const [image] = useImage(`/${selectedImage}`);
  const [markers, setMarkers] = useState<Marker[]>([]);

  const handleClick = (e: any) => {
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event: any) => {
      const spokenLabel = event.results[0][0].transcript || prompt('Label:') || 'unlabeled';
      setMarkers((prev) => [...prev, { x: pointer.x, y: pointer.y, label: spokenLabel }]);
    };

    recognition.onerror = () => {
      const fallbackLabel = prompt('Label (voice failed):') || 'unlabeled';
      setMarkers((prev) => [...prev, { x: pointer.x, y: pointer.y, label: fallbackLabel }]);
    };
  };

  const getImageNameWithoutExtension = (filename: string) => {
    return filename.split('.')[0];
  };

  const saveMarkers = async () => {
    try {
      const blueprintName = getImageNameWithoutExtension(selectedImage);
      const response = await fetch(`http://localhost:5000/api/markers/save/${blueprintName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(markers),
      });
      if (response.ok) {
        alert('Markers saved successfully!');
      } else {
        alert('Failed to save markers.');
      }
    } catch (error) {
      alert('Error saving markers.');
    }
  };

  const autoSaveMarkers = async (updatedMarkers: Marker[]) => {
    try {
      const blueprintName = getImageNameWithoutExtension(selectedImage);
      const response = await fetch(`http://localhost:5000/api/markers/save/${blueprintName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMarkers),
      });
      if (response.ok) {
        console.log('Markers auto-saved successfully!');
      } else {
        console.error('Failed to auto-save markers.');
      }
    } catch (error) {
      console.error('Error auto-saving markers:', error);
    }
  };

  const loadMarkers = async () => {
    try {
      const blueprintName = getImageNameWithoutExtension(selectedImage);
      const response = await fetch(`http://localhost:5000/api/markers/${blueprintName}`);
      if (response.ok) {
        const data = await response.json();
        setMarkers(data);
      } else {
        console.error('Failed to load markers');
      }
    } catch (error) {
      console.error('Error loading markers:', error);
    }
  };
  useEffect(() => {
    loadMarkers();
  }, [selectedImage, loadMarkers]); // Load markers whenever selected image changes

  const undoLast = () => {
    setMarkers((prev) => prev.slice(0, -1));
  };

  const clearMarkers = async () => {
    if (window.confirm('Are you sure you want to clear all markers?')) {
      setMarkers([]);
      try {
        const response = await fetch('http://localhost:5000/api/markers/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([]),
        });
        if (!response.ok) {
          alert('Failed to clear markers on server.');
        }
      } catch (error) {
        alert('Error clearing markers on server.');
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedImage(e.target.value);
  }; // Remove the setMarkers([]) since loadMarkers will handle this

  return (
    <div>
      <select onChange={handleImageChange} value={selectedImage}>
        {imageOptions.map((img) => (
          <option key={img} value={img}>{img}</option>
        ))}
      </select>

      <button onClick={saveMarkers}>Save Markers</button>
      <button onClick={undoLast}>Undo Last</button>

      <Stage width={window.innerWidth} height={window.innerHeight - 100} onClick={handleClick}>
        <Layer>
          {image && <KonvaImage image={image} />}
          {markers.map((marker, i) => (
            <React.Fragment key={i}>
              <Circle 
                x={marker.x} 
                y={marker.y} 
                radius={12} 
                fill="rgba(0,0,255,0.5)" 
                draggable={true}
                onClick={() => {
                  const newLabel = prompt('Edit label:', marker.label);
                  if (newLabel !== null && newLabel !== marker.label) {
                    setMarkers(prev => {
                      const updated = prev.map((m, j) => j === i ? { ...m, label: newLabel } : m);
                      autoSaveMarkers(updated);
                      return updated;
                    });
                  }
                }}
                onDragEnd={e => {
                  const { x, y } = e.target.position();
                  setMarkers(prev => {
                    const updated = prev.map((m, j) => j === i ? { ...m, x, y } : m);
                    autoSaveMarkers(updated);
                    return updated;
                  });
                }}
              />
              <Text x={marker.x + 10} y={marker.y - 10} text={marker.label} fontSize={16} fill="black" />
            </React.Fragment>
          ))}
        </Layer>
      </Stage>
      <button onClick={clearMarkers}>Clear Markers</button>
    </div>
  );
};

export default BlueprintCanvas;
