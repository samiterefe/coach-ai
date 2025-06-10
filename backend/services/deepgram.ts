import 'dotenv/config';
import fetch from 'node-fetch';
import { Express } from 'express';

type DeepgramResponse = {
  results: {
    channels: {
      alternatives: {
        transcript: string;
      }[];
    }[];
  };
};

export const transcribeWithDeepgram = async (audioFile: Express.Multer.File): Promise<string> => {
  try {
    const response = await fetch('https://api.deepgram.com/v1/listen', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
        'Content-Type': audioFile.mimetype,
      },
      body: audioFile.buffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Deepgram API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json() as DeepgramResponse;
    const transcript = result.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
    return transcript;
  } catch (err) {
    console.error('Deepgram transcription error:', err);
    throw err;
  }
};
