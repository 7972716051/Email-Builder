import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [layout, setLayout] = useState(''); // Store the HTML layout
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
  }); // Store field values

  // Retrieve the HTML layout from the backend
  useEffect(() => {
    axios.get('/api/getEmailLayout').then((response) => {
      setLayout(response.data);
    });
  }, []);

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post('/api/uploadImage', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setFormData({ ...formData, imageUrl: response.data.imageUrl });
  };

  // Submit form data to the backend
  const handleSubmit = () => {
    axios.post('/api/uploadEmailConfig', formData).then(() => {
      alert('Template saved successfully!');
    });
  };

  return (
    <div className="App">
      <h1>Email Builder</h1>

      {/* Display editable layout */}
      <div
        className="email-editor"
        dangerouslySetInnerHTML={{ __html: layout }}
        contentEditable
        onInput={(e) => setFormData({ ...formData, content: e.target.innerText })}
      ></div>

      {/* Form for text fields and image upload */}
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
        />
        <textarea
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleInputChange}
        ></textarea>
        <input
          type="file"
          name="image"
          onChange={handleImageUpload}
        />
        <button type="button" onClick={handleSubmit}>Save Template</button>
      </form>

      {/* Debugging: Display current form data */}
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  );
}

export default App;
