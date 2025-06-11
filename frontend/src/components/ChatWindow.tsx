import React, { useState } from "react";
import { FaMicrophone, FaStop, FaPaperPlane, FaMagic } from "react-icons/fa";
import type { Message } from "../types/message";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";
import { sendAudioToBackend } from "../lib/api";
import { BsStars } from "react-icons/bs";

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hi Conor! How can I help you today?", sender: "ai" },
  ]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder();
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const handleStop = async (): Promise<void> => {
    const audioBlob = await stopRecording();
    setRecordedBlob(audioBlob);
  };
  const handleSend = async (blob: Blob): Promise<void> => {
    setIsProcessing(true);
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: "🎤 Audio message", sender: "user" },
    ]);

    try {
      const transcription = await sendAudioToBackend(blob);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: transcription, sender: "ai" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Transcription failed.",
          sender: "ai",
        },
      ]);
    } finally {
      setIsProcessing(false);
      setRecordedBlob(null);
    }
  };

  return (
    <div className="w-full max-w-md h-[600px] bg-white rounded-xl shadow-lg flex flex-col border border-gray-200 relative">
      <div className="bg-[#3f6b85] text-white p-4 rounded-t-xl">
        <h1 className="text-lg font-semibold">Coach AI</h1>
      </div>

      <div className="flex-1 px-4 pt-4 pb-28 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-xl text-sm flex items-center ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.sender === "ai" && (
                <FaMagic className="mr-2 text-xl text-[#3f6b85]" />
              )}
              {msg.text}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 w-full p-4 bg-white  rounded-b-xl">
        <div
          className={`w-full flex items-center justify-between px-4 py-2 rounded-full text-sm font-medium ${
            recordedBlob && !isProcessing
              ? "bg-blue-100 hover:bg-blue-200 text-blue-800"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          <button
            type="button"
            onClick={() => recordedBlob && handleSend(recordedBlob)}
            disabled={!recordedBlob || isProcessing}
            className="flex items-center gap-2 flex-1 text-left focus:outline-none disabled:cursor-not-allowed"
          >
               {isRecording ? <BsStars /> : <FaPaperPlane /> } Ask Me Anything...
         
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isProcessing) {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                isRecording ? handleStop() : startRecording();
              }
            }}
            disabled={isProcessing}
            className={`ml-4 p-3 rounded-full flex items-center justify-center text-white text-xl ${
              isRecording
                ? "bg-red-500 animate-pulse"
                : "bg-blue-400 hover:bg-blue-500"
            } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isRecording ? <FaStop /> : <FaMicrophone />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
