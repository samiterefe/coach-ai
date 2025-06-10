import { Router } from 'express';
import { transcribeAudio } from '../services/openai';
import { transcribeWithDeepgram } from '../services/deepgram';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/transcribe', upload.single('audio'), async (req, res): Promise<void> => {
   console.log("step bofore")
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No audio file provided' });
      return;
    }
    console.log("step one")

    const audioFile = req.file;
    const transcription = await transcribeWithDeepgram(audioFile);


    res.json({ text: transcription });
     console.log('[DEBUG] Using OpenAI API key:', process.env.OPENAI_API_KEY);

  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});


export default router;