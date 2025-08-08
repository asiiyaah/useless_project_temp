import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a banana image first 🍌");
      return;
    }
    // Later: send file to AI backend
    console.log("File ready for upload:", selectedFile);
  };

  return (
    <div className="app">
      {/* Title Section */}
      <header className="header">
        <h1>Banan_alyzer 🍌</h1>
        <p>Is your banana peeled upright or correctly? Let’s find out!</p>
      </header>

      {/* Upload Section */}
      <section className="upload-section">
        <label className="file-label">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {selectedFile ? selectedFile.name : "Choose a banana photo"}
        </label>
        <button onClick={handleUpload}>Analyze Banana</button>
      </section>
    </div>
  );
}
