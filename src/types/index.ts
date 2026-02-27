export interface ImageMetadata {
  id: string;
  file: File;
  objectUrl: string;
  name: string;
  status: 'processing' | 'success' | 'error';
  latitude?: number;
  longitude?: number;
  errorMessage?: string;
}
