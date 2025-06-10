import 'dotenv/config'; 
import OpenAI from 'openai';
import { Express } from 'express';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const transcribeAudio = async (audioFile: Express.Multer.File): Promise<string> => {
  try {
    const file = new File([audioFile.buffer], audioFile.originalname, {
      type: audioFile.mimetype,
    });

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
    });

    return transcription.text;
  } catch (error) {
    console.error('OpenAI transcription error:', error);
    throw error;
  }
};