// @ts-nocheck
import React from 'react';
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  user: any;
  isProcessing: boolean;
}

export default function Header({ user, isProcessing }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg font-bold text-xl">🐾</div>
          <h1 className="text-xl font-bold text-gray-800">Barınak Paneli</h1>
          {isProcessing && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded animate-pulse">İşlem yapılıyor...</span>}
      </div>
      <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-800">{user?.fullName}</p>
            <p className="text-xs text-gray-500 uppercase">{user?.role === 'manager' ? 'Yönetici' : 'Gönüllü'}</p>
          </div>
          <button onClick={() => { localStorage.removeItem("user"); navigate("/"); }} disabled={isProcessing} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition">Çıkış</button>
      </div>
    </header>
  );
}