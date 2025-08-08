import React, { useState } from "react";
import "./App.css";
import * as tmImage from "@teachablemachine/image";

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState("");
  const [model, setModel] = useState(null);

  const MODEL_URL = "/model/"; // Teachable Machine model folder

  // Load model once
  React.useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await tmImage.load(
        MODEL_URL + "model.json",
        MODEL_URL + "metadata.json"
      );
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a banana image first 🍌");
      return;
    }
    if (!model) {
      alert("Model is still loading...");
      return;
    }

    // Preview for classification
    const img = document.createElement("img");
    img.src = URL.createObjectURL(selectedFile);
    await img.decode();

    const prediction = await model.predict(img);
    console.log(prediction);

    // Get the highest confidence prediction
    const best = prediction.reduce((a, b) => (a.probability > b.probability ? a : b));
    setResult(`${best.className} (${(best.probability * 100).toFixed(1)}%)`);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Banan_alyzer 🍌</h1>
        <p>Is your banana peeled upright or correctly? Let’s find out!</p>
      </header>

      <section className="upload-section">
        <label className="file-label">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {selectedFile ? selectedFile.name : "Choose a banana photo"}
        </label>
        <button onClick={handleUpload}>Analyze Banana</button>
      </section>

      {result && (
        <section className="result-section">
          <h2>Result: {result}</h2>
        </section>
      )}
    </div>
  );
}
