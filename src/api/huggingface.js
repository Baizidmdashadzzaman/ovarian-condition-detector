import { Client } from "@gradio/client";

let client = null;

// Connect once to your Hugging Face Space
export async function getClient() {
  if (!client) {
    client = await Client.connect("ashad0167/ovarian-condition-detector");
  }
  return client;
}

export async function predictOvarianCondition(file) {
  const client = await getClient();
  const result = await client.predict("/predict", { image: file });

  // result.data[0] -> predictions
  // result.data[1] -> file object with URL
  const predData = result.data[0];
  const gradcamFile = result.data[1];

  // Extract Grad-CAM URL
  let heatmapUrl = "";
  if (gradcamFile && gradcamFile.url) {
    heatmapUrl = gradcamFile.url;
  }

  // Convert Gradio Label format to { class: prob }
  let preds = {};
  if (predData && predData.confidences) {
    predData.confidences.forEach((c) => {
      preds[c.label] = c.confidence;
    });
  }

  return {
    predictions: preds,
    heatmap: heatmapUrl
  };
}

