import React, { useState } from 'react';

const PlanUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }
    const formData = new FormData();
    formData.append('plan', file);

    try {
      const res = await fetch('http://localhost:5001/api/plans/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Upload successful!');
      } else {
        setMessage(data.error || 'Upload failed.');
      }
    } catch (err) {
      setMessage('Server error.');
    }
  };

  return (
    <div>
      <h2>Upload Blueprint</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PlanUpload;
