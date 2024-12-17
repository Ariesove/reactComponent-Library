import { useState } from "react";
import { useEffect } from "react";
function Upload() {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  // 记录每个分片的状态
  const [uploadStates, setUploadStates] = useState({});
  function calculateChunkSize(fileSize) {
    if (fileSize < 10 * 1024 * 1024) {
      // 小于10MB
      return 1 * 1024 * 1024; // 1MB
    } else if (fileSize < 100 * 1024 * 1024) {
      // 10MB到100MB之间
      return 5 * 1024 * 1024; // 5MB
    } else {
      // 大于100MB
      return 10 * 1024 * 1024; // 10MB
    }
  }

  // 在 FileUploader 组件中使用
  const CHUNK_SIZE = calculateChunkSize(file?.size);
  // const CHUNK_SIZE = 1 * 1024 * 1024; // 分片大小，这里以1MB为例

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const totalChunks = Math.ceil(file?.size / CHUNK_SIZE);
  const uploadFile = async () => {
    if (!file) return;

    for (let i = 0; i < totalChunks; i++) {
      try {
        await uploadChunk(i, totalChunks);
        setUploadStates((prev) => {
          return {
            ...prev,
            [i]: { ...prev[i], status: "success", index: i },
          };
        });
        setUploadProgress(((i + 1) / totalChunks) * 100);
      } catch (error) {
        setError(error.message);
        setUploadStates((prev) => {
          return {
            ...prev,
            [i]: { ...prev[i], status: "failed", index: i },
          };
        });
        await retryFailedChunks();
        console.error("Error in uploading chunk", error);
        break;
      }
    }

    if (uploadProgress === 100) {
      alert("Upload completed!");
    }
  };
  const retryFailedChunks = async () => {
    console.log(
      "%c [  ]-63",
      "font-size:13px; background:pink; color:#bf2c9f;",
      uploadStates
    );
    const failedIndices = Object.values(uploadStates)
      .filter((state) => state.status === "failed")
      .map((state) => state.index);

    for (const index of failedIndices) {
      try {
        console.log("33433", 33433);
        await uploadChunk(index, totalChunks);
        setUploadStates((prev) => {
          return {
            ...prev,
            [index]: { ...prev[index], status: "success" },
          };
        });
      } catch (error) {
        console.error(`Retry failed for chunk ${index}:`, error);
        // 可以选择再次尝试或显示错误信息给用户
      }
    }
  };

  const uploadChunk = async (chunkIndex, totalChunks) => {
    const chunkStart = chunkIndex * CHUNK_SIZE;
    const chunkEnd = Math.min(file.size, chunkStart + CHUNK_SIZE);
    const chunk = file.slice(chunkStart, chunkEnd);

    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("index", chunkIndex);
    formData.append("totalChunks", totalChunks); // 传递总分片数以便后端合并
    console.log("chunkIndex, totalChunks", chunkIndex, totalChunks);
    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Chunk uploaded", data);
  };

  useEffect(() => {
    console.log("uploadStates", uploadStates);
  }, [uploadStates]);
  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile} disabled={!file}>
        Upload
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {uploadProgress > 0 && (
        <progress value={uploadProgress} max="100">
          {uploadProgress}%
        </progress>
      )}
    </div>
  );
}

export default Upload;
