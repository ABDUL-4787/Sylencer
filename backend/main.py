from fastapi import FastAPI, UploadFile, File
import uvicorn
import librosa
import numpy as np
import tensorflow_hub as hub
import tensorflow as tf
import tempfile

# Initialize FastAPI app
app = FastAPI(title="Machine Sound Analyzer API")

# Load pretrained YAMNet
yamnet = hub.load("https://tfhub.dev/google/yamnet/1")

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # Load audio file
        waveform, sr = librosa.load(tmp_path, sr=16000, mono=True)

        # Get predictions
        scores, embeddings, spectrogram = yamnet(waveform)

        # For now: just take average embedding and run a dummy classification
        mean_embedding = np.mean(embeddings, axis=0)

        # ⚠️ Placeholder logic
        # Later you'll train a classifier on embeddings.
        # Here we just simulate with a threshold:
        anomaly_score = np.linalg.norm(mean_embedding)

        prediction = "Normal" if anomaly_score < 300 else "Faulty"

        return {"prediction": prediction}
    
    except Exception as e:
        return {"error": str(e)}

# Run server: uvicorn main:app --reload --port 8000
