import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import BananaCatch from "./BananaCatch";

import JSConfetti from "js-confetti";
import { gsap } from "gsap";

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

  // Refs for animation
  const appRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const analyzerRef = useRef(null);

  useEffect(() => {
    // Set initial state
    gsap.set(appRef.current, { opacity: 1 });
    gsap.set(analyzerRef.current, { scale: 1.5, rotate: 360, opacity: 0 });
    gsap.set(".ques", { opacity: 0 });
    gsap.set(".ques2", { opacity: 0 });

    setTimeout(() => {
      // Animate analyzer: scale and rotate in
      gsap.to(analyzerRef.current, {
        scale: 1,
        rotate: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          // Animate all .ques elements with staggered fade in
          gsap.to(".ques", {
            opacity: 1,
            duration: 0.7,
            stagger: 0.25,
            ease: "power2.out",
          });
          gsap.to(".ques2", {
            opacity: 1,
            duration: 0.7,
            stagger: 0.25,
            ease: "power2.out",
          });
        },
      });
    }, 2000);
  }, []);

  useEffect(() => {
    const jsConfetti = new JSConfetti();
    jsConfetti.addConfetti({
      emojis: ["🍌"],
      emojiSize: 100,
      confettiNumber: 10,
    });
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
    const best = prediction.reduce((a, b) =>
      a.probability > b.probability ? a : b
    );
    setResult(`${best.className} (${(best.probability * 100).toFixed(1)}%)`);
  };

  return (
    <div className="container">
      <div className="app " ref={appRef}>
        {/* Title Section */}
        <div>
          <header className="header" ref={headerRef}>
            <h1 className="analyzer" ref={analyzerRef}>
              Banan-alyzer{" "}
            </h1>
            <h2 className="ques2">BANANA OR ANANAB</h2>
            <p className="ques">
              Is your banana peeled upright or correctly? Let’s find out!
            </p>
          </header>
          {/* Upload Section and rest of content */}
          <div ref={contentRef}>
            <canvas className="banana-confetti"></canvas>
            <section className="upload-section">
              <label className="file-label ques">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {selectedFile ? selectedFile.name : "Choose a banana photo"}
              </label>
              <button className="ques" onClick={handleUpload}>
                Analyze Banana
              </button>
            </section>
          </div>
          {result && (
            <section className="result-section">
              <h2>Result: {result}</h2>
            </section>
          )}
        </div>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          marginTop: "2rem",
        }}
      >
        <BananaCatch />
      </div>
    </div>
  );
}
