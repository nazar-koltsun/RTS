import { supabase, ensureValidSession, isRefreshTokenError } from './supabase';

/**
 * Upload an image to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} bucketName - Name of the storage bucket
 * @param {string} folder - Optional folder path within the bucket
 * @returns {Promise<string>} Public URL of the uploaded file
 */
export async function uploadImage(file, bucketName = 'avatars', folder = '') {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Delete an image from Supabase Storage
 * @param {string} filePath - Path to the file in storage
 * @param {string} bucketName - Name of the storage bucket
 */
export async function deleteImage(filePath, bucketName = 'avatars') {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

/**
 * Get public URL for an image in Supabase Storage
 * @param {string} filePath - Path to the file in storage
 * @param {string} bucketName - Name of the storage bucket
 * @returns {string} Public URL
 */
export function getImageUrl(filePath, bucketName = 'avatars') {
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
  
  return publicUrl;
}

/**
 * Upload a PDF file to Supabase Storage
 * @param {File} file - The PDF file to upload
 * @param {string} bucketName - Name of the storage bucket (default: 'invoice-documents')
 * @param {string} folder - Optional folder path within the bucket
 * @returns {Promise<string>} Public URL of the uploaded file
 */
export async function uploadPDF(file, bucketName = 'invoice-documents', folder = '') {
  try {
    // Validate file type
    if (file.type !== 'application/pdf') {
      throw new Error('File must be a PDF');
    }

    // Ensure user has a valid session (refreshes if expired, logs out if too old)
    const session = await ensureValidSession();
    
    // If session is null, user was logged out and redirected
    if (!session) {
      throw new Error('Session expired. Please log in and try again.');
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const fileName = `${timestamp}-${randomStr}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      // Check if it's a refresh token error
      if (isRefreshTokenError(error)) {
        // Re-throw as is - the calling code will handle logout
        throw error;
      }
      
      // Provide more helpful error messages
      if (error.message?.includes('row-level security')) {
        throw new Error(
          'Storage bucket RLS policy error. Please configure storage policies in Supabase dashboard. ' +
          'See STORAGE_SETUP.md for instructions. Error: ' + error.message
        );
      }
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
}










