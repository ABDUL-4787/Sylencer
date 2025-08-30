async function analyzeSound() {
  const fileInput = document.getElementById("audioFile");
  const resultDiv = document.getElementById("result");

  if (fileInput.files.length === 0) {
    resultDiv.innerHTML = "⚠️ Please select a file first.";
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);

  resultDiv.innerHTML = "⏳ Analyzing sound...";

  try {
    // Send to backend API (e.g., Flask/FastAPI endpoint)
    const response = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Server error: " + response.statusText);
    }

    const data = await response.json();
    resultDiv.innerHTML = `✅ Result: <b>${data.prediction}</b>`;
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = "❌ Error analyzing sound.";
  }
}
