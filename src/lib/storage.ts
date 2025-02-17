import api from './api';

export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image must be less than 5MB');
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.url;
  } catch (error: any) {
    console.error('Error handling image:', error);
    throw new Error(`Error handling image: ${error.message}`);
  }
};

export const deleteImage = async (key: string): Promise<void> => {
  await api.delete(`/uploads/${key}`);
};