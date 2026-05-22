export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.warn('Cloudinary credentials missing. File will be uploaded but might fail if invalid.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset || '');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Cloudinary upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
