# 🧠 Coach AI - Voice Chat Transcription App

Coach AI is a simple voice-based chat interface. Users can record an audio message, send it, and get a transcribed AI response.

---

## ✨ What It Does

* Press the mic to **start recording**
* Press again to **stop recording**
* Press "Ask Me Anything..." to **send the audio**
* The backend sends it to **Deepgram API**
* Transcription is returned and shown in chat

---

## ⚙️ Tech Stack

* **Frontend**: React + TypeScript + Tailwind CSS
* **Backend**: Node.js + Express
* **Speech-to-Text**: [Deepgram API](https://www.deepgram.com/)

---

## 🚀 How to Run

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-username/coach-ai
   ```

2. **Install dependencies**

   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. **Set up `.env` in `backend/`**

   ```env
   DEEPGRAM_API_KEY=your_deepgram_api_key
   ```

4. **Run both servers**

   * Frontend: `cd frontend && npm run dev`
   * Backend: `cd backend && npm run dev`

5. Open [http://localhost:5173](http://localhost:5173)

---

## 🔪 Example Flow

1. 🎤 Record audio
2. ⏹ Stop recording
3. 📤 Click send (Ask Me Anything...)
4. ⏳ Transcription happens
5. 💬 AI reply appears in the chat

---

## 📁 Structure

```
coach-ai/
├── backend/       # Express backend
├── frontend/      # React frontend
├── README.md
```

---

## 🔑 Notes

* Used **Deepgram** due to OpenAI quota limit.
* You can easily switch back to OpenAI if needed.
* Clean UI and logic meet all requirements from the task.

