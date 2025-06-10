import { useState } from 'react';
import { FaMicrophone, FaPaperPlane, FaStop } from 'react-icons/fa';
import type { Message } from './types/message';
import { useVoiceRecorder } from './hooks/useVoiceRecorder';
import { sendAudioToBackend } from './lib/api';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hi there! How can I help?', sender: 'ai' },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isRecording, startRecording, stopRecording, hasAudio, audioChunksRef } = useVoiceRecorder();

  const handleStop = async () => {
    const audioBlob = await stopRecording();
    await handleSend(audioBlob);
  };

  const handleSend = async (audioBlob: Blob) => {
    setIsProcessing(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: '🎤 Audio message',
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const transcription = await sendAudioToBackend(audioBlob);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: transcription,
        sender: 'ai',
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: 'Transcription failed.', sender: 'ai' },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden flex flex-col" style={{ height: '600px' }}>
        {/* Header */}
        <div className="bg-blue-500 text-white p-4">
          <h1 className="text-lg font-semibold">Coach AI</h1>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex gap-2 items-center">
            <button
              onClick={isRecording ? handleStop : startRecording}
              disabled={isProcessing}
              className={`p-3 rounded-full ${isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-gray-200 hover:bg-gray-300'} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isRecording ? <FaStop /> : <FaMicrophone />}
            </button>

            <button
              onClick={async () => {
                if (audioChunksRef.current.length) {
                  const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                  await handleSend(blob);
                }
              }}
              disabled={!hasAudio || isProcessing}
              className={`p-3 rounded-full ${hasAudio && !isProcessing
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-400 cursor-not-allowed'}`}
            >
              <FaPaperPlane />
            </button>

            <div className="text-sm text-gray-500 ml-2">
              {isRecording ? 'Recording...' :
                isProcessing ? 'Processing...' :
                  hasAudio ? 'Ready to send' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
