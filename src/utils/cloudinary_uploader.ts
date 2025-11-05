import type { CloudinaryUploadParams } from '../types/profile/user_profile';

/**
 * Cloudinary Upload Error
 */
export class CloudinaryUploadError extends Error {
  public statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'CloudinaryUploadError';
    this.statusCode = statusCode;
  }
}

/**
 * Upload image to Cloudinary using signed URL and parameters
 * 
 * Server signs only: timestamp + folder
 * Client sends: file, timestamp, signature, api_key, folder
 */
export async function uploadImageToCloudinary(
  file: File | Blob,
  uploadUrl: string,
  params: CloudinaryUploadParams,
  fileName?: string
): Promise<string> {
  // Client-side validation (optional, server will also validate)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp'];
  
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new CloudinaryUploadError(
      `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`
    );
  }

  // Validate file format (only for File, skip for Blob)
  if (file instanceof File) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !ALLOWED_FORMATS.includes(fileExtension)) {
      throw new CloudinaryUploadError(
        `File format not allowed. Allowed formats: ${ALLOWED_FORMATS.join(', ')}`
      );
    }
  }

  // Create FormData with signed parameters
  const formData = new FormData();
  
  // Convert Blob to File if needed for FormData
  const fileToUpload = file instanceof File 
    ? file 
    : new File([file], fileName || 'cropped-image.jpg', { type: 'image/jpeg' });
  
  // Add file (not part of signature)
  formData.append('file', fileToUpload);
  
  // Add signed parameters in the EXACT order the server signed them:
  // folder + timestamp (signature validates these two)
  formData.append('folder', params.folder);
  formData.append('timestamp', params.timestamp.toString());
  
  // Add api_key and signature (required for upload)
  formData.append('api_key', params.api_key);
  formData.append('signature', params.signature);

  try {
    // Upload to Cloudinary
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new CloudinaryUploadError(
        errorData.error?.message || `Upload failed with status ${response.status}`,
        response.status
      );
    }

    const result = await response.json();
    
    // Return the secure URL of the uploaded image
    return result.secure_url || result.url;
  } catch (error) {
    if (error instanceof CloudinaryUploadError) {
      throw error;
    }
    throw new CloudinaryUploadError(
      error instanceof Error ? error.message : 'Failed to upload image to Cloudinary'
    );
  }
}

