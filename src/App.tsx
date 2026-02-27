import { useState, useCallback } from 'react';
import { MapPin, X } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { MapDisplay } from './components/MapDisplay';
import { processImageFile } from './utils/exifUtils';
import type { ImageMetadata } from './types';
import './App.css';

function App() {
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [alerts, setAlerts] = useState<{ id: string; title: string; message: string }[]>([]);

  const addAlert = (title: string, message: string) => {
    const id = Date.now().toString();
    setAlerts(prev => [...prev, { id, title, message }]);
    
    // Auto-remove alert after 5 seconds
    setTimeout(() => {
      removeAlert(id);
    }, 5000);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleImagesSelected = useCallback(async (files: File[]) => {
    // Determine existing files to avoid processing duplicates
    const existingFileNames = new Set(images.map(img => img.name));
    const newFiles = files.filter(file => !existingFileNames.has(file.name));

    if (newFiles.length === 0) return;

    // Add placeholder processing entries
    const initialMetadataList: ImageMetadata[] = newFiles.map(file => ({
      id: `${file.name}-${Date.now()}`,
      file,
      objectUrl: URL.createObjectURL(file), // Temp URL for immediate thumbnail
      name: file.name,
      status: 'processing'
    }));

    setImages(prev => [...prev, ...initialMetadataList]);

    // Process each file
    for (const newImg of initialMetadataList) {
      const processed = await processImageFile(newImg.file);
      
      setImages(prev => prev.map(img => img.id === newImg.id ? { ...processed, id: img.id } : img));

      if (processed.status === 'error') {
        addAlert('Missing GPS Data', `Could not find location metadata for ${processed.name}.`);
      }
    }
  }, [images]);

  // Intentionally leaving URLs active for the session to prevent them from breaking when new images are added.

  return (
    <div className="app-container">
      {/* Background Map layer */}
      <MapDisplay images={images} />

      {/* Floating UI Overlay */}
      <div className="overlay-ui">
        <div className="header-panel glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h1 className="app-title">
            <MapPin size={28} />
            ExifMapper
          </h1>
          <p className="app-subtitle">
            Extract GPS metadata from your photos and instantly visualize them on the map. 100% private, processed in your browser.
          </p>
        </div>

        <div style={{ animationDelay: '0.2s' }} className="animate-fade-in">
          <ImageUploader onImagesSelected={handleImagesSelected} images={images} />
        </div>
      </div>

      {/* Toast Alerts Overlay */}
      <div className="alerts-container">
        {alerts.map(alert => (
          <div key={alert.id} className="toast-alert">
            <X size={20} className="toast-icon" />
            <div className="toast-content">
              <div className="toast-title">{alert.title}</div>
              <div className="toast-message">{alert.message}</div>
            </div>
            <button className="toast-close" onClick={() => removeAlert(alert.id)}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
