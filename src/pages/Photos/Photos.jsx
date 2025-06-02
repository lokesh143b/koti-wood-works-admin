import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
} from "react";
import "./Photos.css";
import { AdminContext } from "../../context/AdminContext"; // adjust path as necessary

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
  });
  const observer = useRef();

  const adminToken = localStorage.getItem("adminToken");
  const { BASE_URL } = useContext(AdminContext);

  const fetchPhotos = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/api/photos?page=${page}&limit=5`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch photos");
      const data = await res.json();

      if (data.photos.length === 0) {
        setHasMore(false);
      } else {
        setPhotos((prev) => {
          const existingIds = new Set(prev.map((photo) => photo._id));
          const newPhotos = data.photos.filter(
            (photo) => !existingIds.has(photo._id)
          );
          return [...prev, ...newPhotos];
        });
      }
    } catch (error) {
      alert("Error fetching photos: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasMore && !isLoading) {
      fetchPhotos();
    }
  }, [page]);

  const lastPhotoRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, isLoading]
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this photo?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/photos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Failed to delete photo: " + errorData.message);
        return;
      }

      setPhotos((prev) => prev.filter((photo) => photo._id !== id));
    } catch (error) {
      alert("Error deleting photo: " + error.message);
    }
  };

  const handleUpdate = (photo) => {
    setEditingPhoto(photo);
    setFormData({
      name: photo.name || "",
      category: photo.category || "",
      description: photo.description || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitUpdate = async () => {
    if (!editingPhoto) return alert("No photo selected for editing.");
    try {
      const res = await fetch(`${BASE_URL}/api/photos/${editingPhoto._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Failed to update photo: " + errorData.message);
        return;
      }

      const updatedPhoto = await res.json();
      setPhotos((prev) =>
        prev.map((photo) =>
          photo._id === updatedPhoto._id ? updatedPhoto : photo
        )
      );
      setEditingPhoto(null);
    } catch (error) {
      alert("Error updating photo: " + error.message);
    }
  };

  return (
    <div className="photos-container">
      <h2>All Photos</h2>
      <div className="photos-grid">
        {photos.map((photo, index) => (
          <div
            className="photo-card"
            key={photo._id}
            ref={index === photos.length - 1 ? lastPhotoRef : null}
          >
            <img src={photo.imageUrl} alt={photo.name} />
            <div className="photo-info">
              <h4>{photo.name}</h4>
              <p>{photo.category}</p>
              <p className="desc">{photo.description}</p>
              <div className="actions">
                <button
                  className="update-btn"
                  onClick={() => handleUpdate(photo)}
                >
                  Update
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(photo._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      {!hasMore && <p className="end-text">No more photos.</p>}

      {editingPhoto && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Photo</h3>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </label>
            <label>
              Category:
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </label>
            <div className="modal-actions">
              <button onClick={handleSubmitUpdate}>Save</button>
              <button onClick={() => setEditingPhoto(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;
