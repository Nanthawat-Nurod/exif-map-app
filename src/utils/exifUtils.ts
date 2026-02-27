import exifr from 'exifr';
import type { ImageMetadata } from '../types';

/**
 * Extracts GPS coordinates from an image file using exifr.
 * @param file The image file to parse
 * @returns An object containing latitude and longitude or null if no GPS data is found.
 */
export async function extractGPSData(file: File): Promise<{ latitude: number; longitude: number } | null> {
    try {
        // exifr.gps returns { latitude, longitude } directly if found
        const gpsData = await exifr.gps(file);

        if (gpsData && gpsData.latitude !== undefined && gpsData.longitude !== undefined) {
            return {
                latitude: gpsData.latitude,
                longitude: gpsData.longitude
            };
        }

        return null;
    } catch (error) {
        console.error(`Error parsing EXIF data for ${file.name}:`, error);
        return null;
    }
}

/**
 * Creates an ImageMetadata object from a raw File.
 * This function also extracts GPS data and returns the populated object.
 */
export async function processImageFile(file: File): Promise<ImageMetadata> {
    const objectUrl = URL.createObjectURL(file);
    const id = `${file.name}-${Date.now()}`;

    const metadata: ImageMetadata = {
        id,
        file,
        objectUrl,
        name: file.name,
        status: 'processing'
    };

    try {
        const gps = await extractGPSData(file);

        if (gps) {
            metadata.latitude = gps.latitude;
            metadata.longitude = gps.longitude;
            metadata.status = 'success';
        } else {
            metadata.status = 'error';
            metadata.errorMessage = 'No GPS metadata found';
        }
    } catch (err) {
        metadata.status = 'error';
        metadata.errorMessage = 'Failed to extract EXIF data';
    }

    return metadata;
}

/**
 * Cleans up Object URLs to prevent memory leaks.
 */
export function cleanupImageUrls(images: ImageMetadata[]) {
    images.forEach(img => URL.revokeObjectURL(img.objectUrl));
}
