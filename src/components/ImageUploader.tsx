import React, { useRef, useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import type { ImageMetadata } from '../types';

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
  images: ImageMetadata[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesSelected, images }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      onImagesSelected(filesArray);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
      onImagesSelected(filesArray);
    }
  };

  return (
    <div className="upload-panel glass-panel animate-fade-in">
      <div 
        className={`drop-zone ${isDragging ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud className="upload-icon" />
        <div>
          <h3 className="upload-text">Drag & Drop images here</h3>
          <p className="upload-hint">or click to browse files</p>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileInput} 
          className="file-input" 
          multiple 
          accept="image/*" 
        />
      </div>

      {images.length > 0 && (
        <div className="images-list-panel mt-4">
          <h4 className="text-sm font-semibold mb-2">Processed Images</h4>
          {images.map(img => (
            <div key={img.id} className="image-item">
              <img src={img.objectUrl} alt={img.name} className="image-thumbnail" />
              <div className="image-info">
                <div className="image-name" title={img.name}>{img.name}</div>
                <div className="image-status">
                  {img.status === 'processing' && (
                    <><Loader2 className="w-3 h-3 animate-spin status-processing" /> <span>Extracting data...</span></>
                  )}
                  {img.status === 'success' && (
                    <><CheckCircle2 className="w-3 h-3 status-success" /> <span>GPS Found</span></>
                  )}
                  {img.status === 'error' && (
                    <><AlertCircle className="w-3 h-3 status-error" /> <span>{img.errorMessage}</span></>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
