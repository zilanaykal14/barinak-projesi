// @ts-nocheck
import React from 'react';

// Gelen verilerin tiplerini tanımlıyoruz
interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any; // Kullanıcı objesi (Detaylı tip yerine any kullandık, hata vermesin)
  bekleyenSayisi: number;
  setIsIhbarOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, user, bekleyenSayisi, setIsIhbarOpen }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col space-y-2">
      <button 
        onClick={() => setActiveTab("animals")} 
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "animals" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}
      >
        <span>🐶</span><span>Hayvan Listesi</span>
      </button>
      
      {user?.role === 'manager' && (
        <>
          <button onClick={() => setActiveTab("users")} className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "users" ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:bg-gray-50"}`}><span>👥</span><span>Kullanıcılar</span></button>
          <button onClick={() => setActiveTab("bildirimler")} className={`flex justify-between items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "bildirimler" ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-50"}`}>
              <div className="flex items-center space-x-3"><span>🔔</span><span>Gelen İstekler</span></div>
              {bekleyenSayisi > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{bekleyenSayisi}</span>}
          </button>
          <button onClick={() => setActiveTab("sahiplenenler")} className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "sahiplenenler" ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"}`}><span>🏠</span><span>Sahiplenenler</span></button>
        </>
      )}
      
      {user?.role === 'volunteer' && (
        <>
          <button onClick={() => setActiveTab("basvurularim")} className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "basvurularim" ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"}`}><span>📝</span><span>Başvurularım</span></button>
          <button onClick={() => setIsIhbarOpen(true)} className="mt-4 bg-orange-500 text-white px-4 py-3 rounded-lg text-sm font-bold hover:bg-orange-600 shadow-md">📢 Sokak Hayvanı Bildir</button>
        </>
      )}
    </aside>
  );
}