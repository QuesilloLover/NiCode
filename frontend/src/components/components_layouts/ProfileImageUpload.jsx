import React, { useState } from 'react';
import axios from 'axios';

const ProfileImageUpload = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('profile_image', selectedFile);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      console.log(`Token: ${token}`); // Debugging: Check if the token is retrieved correctly
      const response = await axios.post('http://127.0.0.1:8000/upload-profile-image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`
        },
      });
      console.log('Image uploaded successfully:', response.data);
      onUploadSuccess(response.data.profile_image); // Call the success function with the new image URL
    } catch (error) {
      console.error('Error uploading image:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>
  );
};

export default ProfileImageUpload;