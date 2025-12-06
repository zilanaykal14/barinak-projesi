// @ts-nocheck
import React from 'react';

interface StatsCardsProps {
  hayvanlar: any[]; // Hayvan listesi bir dizidir (array)
}

export default function StatsCards({ hayvanlar }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h3 className="text-gray-400 text-xs font-bold uppercase">Toplam</h3><p className="text-3xl font-bold text-gray-800">{hayvanlar.length}</p></div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h3 className="text-gray-400 text-xs font-bold uppercase">Sahiplendirilebilir</h3><p className="text-3xl font-bold text-green-600">{hayvanlar.filter((h:any) => h.durum === 'Sahiplendirilebilir').length}</p></div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h3 className="text-gray-400 text-xs font-bold uppercase">Tedavide</h3><p className="text-3xl font-bold text-orange-600">{hayvanlar.filter((h:any) => h.durum === 'Tedavide').length}</p></div>
    </div>
  );
}