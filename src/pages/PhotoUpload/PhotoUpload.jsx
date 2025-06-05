
// const categories = [
//   'Furniture', 'Modular Kitchen', 'Wardrobes', 'Interior Design',
//   'Doors & Windows', 'Wall Panels', 'TV Units', 'Wooden Flooring',
//   'Office Furniture', 'Custom Work'
// ];

import React, { useState, useContext, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import './PhotoUpload.css';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';

const PhotoUpload = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    image: null,
  });

  const [categories, setCategories] = useState([]);          // categories from backend
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState('');

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);          // form submit loading state

  const navigate = useNavigate();
  const { BASE_URL } = useContext(AdminContext);

  // Fetch categories from backend on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setCategoriesError('');

        const response = await fetch(`${BASE_URL}/api/photos/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoriesError('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [BASE_URL]);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (files && name === 'image') {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(files[0], options);
        setFormData((prevData) => ({
          ...prevData,
          image: compressedFile,
        }));
      } catch (error) {
        console.error('Image compression failed:', error);
        setErrorMsg('Image compression failed');
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!formData.image) {
      setErrorMsg('Please select an image');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('image', formData.image);

    const adminToken = localStorage.getItem('adminToken');

    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/api/photos/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      setSuccessMsg('Photo uploaded successfully!');
      navigate("/photos");
      console.log('Uploaded:', result);

      setFormData({
        name: '',
        category: '',
        description: '',
        image: null,
      });

      document.querySelector('input[type="file"]').value = '';
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || 'Error uploading photo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-container">
      {isLoading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <h2>Upload a Photo</h2>

      {loadingCategories ? (
        <p>Loading categories...</p>
      ) : categoriesError ? (
        <p className="error-msg">{categoriesError}</p>
      ) : (
        <form className="upload-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Photo Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter photo name"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Upload Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Write a short description..."
              required
            />
          </div>

          <button type="submit" className="upload-btn" disabled={isLoading}>
            {isLoading ? "Uploading..." : "Upload"}
          </button>

          {successMsg && <p className="success-msg">{successMsg}</p>}
          {errorMsg && <p className="error-msg">{errorMsg}</p>}
        </form>
      )}
    </div>
  );
};

export default PhotoUpload;
