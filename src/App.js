import React, { useState } from "react";
import { predictOvarianCondition } from "./api/huggingface";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

const handleSubmit = async () => {
  if (!selectedFile) return;
  setLoading(true);

  try {
    const result = await predictOvarianCondition(selectedFile);

    console.log("API Result:", result); // 👀 Debugging

    let preds = {};

    // Case 1: result.predictions is a simple dict
    if (result.predictions && typeof result.predictions === "object" && !result.predictions.label) {
      preds = result.predictions;
    }
    // Case 2: Gradio Label output format
    else if (result.predictions && result.predictions.confidences) {
      result.predictions.confidences.forEach((c) => {
        preds[c.label] = c.confidence;
      });
    }

    setPredictions(preds);
    setHeatmap(result.heatmap);
  } catch (err) {
    console.error(err);
    alert("Error while predicting");
  }

  setLoading(false);
};


  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>🩺 Ovarian Ultrasound Classifier</h2>

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Upload & Predict"}
      </button>

      {predictions && (
        <div style={{ marginTop: "20px" }}>
          <h3>Predictions</h3>
          <ul>
            {Object.entries(predictions).map(([cls, prob]) => (
              <li key={cls}>
                {cls}: {(prob * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      )}

      {heatmap && (
  <div style={{ marginTop: "20px" }}>
    <h3>Grad-CAM Heatmap</h3>
    <img
      src={heatmap}
      alt="Grad-CAM Heatmap"
      style={{ maxWidth: "100%", border: "1px solid #ccc" }}
    />
  </div>
)}

    </div>
  );
}

export default App;
