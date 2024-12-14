import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import useEffect from 'react';
function App() {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const CHUNK_SIZE = 1 * 1024 * 1024; // 分片大小，这里以1MB为例

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return;

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i++) {
      try {
        await uploadChunk(i, totalChunks);
        setUploadProgress(((i + 1) / totalChunks) * 100);
      } catch (error) {
        setError(error.message);
        console.error('Error in uploading chunk', error);
        break;
      }
    }

    if (uploadProgress === 100) {
      alert('Upload completed!');
    }
  };

  const uploadChunk = async (chunkIndex, totalChunks) => {
    const chunkStart = chunkIndex * CHUNK_SIZE;
    const chunkEnd = Math.min(file.size, chunkStart + CHUNK_SIZE);
    const chunk = file.slice(chunkStart, chunkEnd);

    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('index', chunkIndex);
    formData.append('totalChunks', totalChunks); // 传递总分片数以便后端合并

    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Chunk uploaded', data);
  };
  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile} disabled={!file}>
        Upload
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {uploadProgress > 0 && (
        <progress value={uploadProgress} max="100">
          {uploadProgress}%
        </progress>
      )}
    </div>
  );
}

export default App;
