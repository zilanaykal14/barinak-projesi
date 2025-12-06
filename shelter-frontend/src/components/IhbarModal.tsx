// @ts-nocheck
import React from 'react';

interface IhbarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (e: any) => void;
  message: string;
  setMessage: (msg: string) => void;
  isProcessing: boolean;
}

export default function IhbarModal({ isOpen, onClose, onSend, message, setMessage, isProcessing }: IhbarModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 className="font-bold text-lg mb-4 text-gray-800">Sokak Hayvanı Bildir 📢</h3>
        <textarea 
          className="w-full border rounded-lg p-3 text-sm" 
          rows={4} 
          placeholder="Detaylar..." 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          disabled={isProcessing}
        ></textarea>
        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="text-gray-500" disabled={isProcessing}>İptal</button>
          <button onClick={onSend} className="bg-orange-500 text-white px-4 py-2 rounded" disabled={isProcessing}>Gönder</button>
        </div>
      </div>
    </div>
  );
}