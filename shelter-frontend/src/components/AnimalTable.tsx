// @ts-nocheck
import React from 'react';

// Fonksiyonları (void) ve verileri (any) tanımlıyoruz
interface AnimalTableProps {
  hayvanlar: any[];
  user: any;
  getImageUrl: (url: string) => string;
  handleEdit: (hayvan: any) => void;
  handleDelete: (id: any) => void;
  handleSahiplenmeIstegi: (hayvan: any) => void;
  setIsModalOpen: (val: boolean) => void;
  resetForm: () => void;
}

export default function AnimalTable({ hayvanlar, user, getImageUrl, handleEdit, handleDelete, handleSahiplenmeIstegi, setIsModalOpen, resetForm }: AnimalTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">Hayvan Listesi</h2>
        {user?.role === 'manager' && (
          <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">+ Yeni Hayvan</button>
        )}
      </div>
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-6 py-4">Resim</th><th className="px-6 py-4">Adı</th><th className="px-6 py-4">Irk</th><th className="px-6 py-4">Çip</th><th className="px-6 py-4">Aşılar</th><th className="px-6 py-4">Durum</th><th className="px-6 py-4 text-right">İşlemler</th></tr></thead>
        <tbody className="divide-y divide-gray-100">
          {hayvanlar.map((hayvan:any) => (
            <tr key={hayvan.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden">
                  <img src={getImageUrl(hayvan.resimUrl)} alt={hayvan.ad} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://placehold.co/100"; }} />
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-gray-900">{hayvan.ad}</td>
              <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{hayvan.irk ? hayvan.irk.ad : '-'}</span></td>
              <td className="px-6 py-4 font-mono text-xs text-gray-500">{hayvan.cip ? hayvan.cip.numara : '-'}</td>
              <td className="px-6 py-4"><div className="flex flex-wrap gap-1">{hayvan.asilar?.map((asi:any) => <span key={asi.id} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{asi.ad}</span>)}</div></td>
              <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${hayvan.durum === 'Tedavide' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>{hayvan.durum}</span></td>
              <td className="px-6 py-4 text-right space-x-2">
                {user?.role === 'manager' ? (
                  <><button onClick={() => handleEdit(hayvan)} className="text-blue-600 hover:text-blue-900 font-medium">Düzenle</button><button onClick={() => handleDelete(hayvan.id)} className="text-red-600 hover:text-red-900 font-medium">Sil</button></>
                ) : (
                  hayvan.durum === 'Sahiplendirilebilir' && <button onClick={() => handleSahiplenmeIstegi(hayvan)} className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition shadow">Sahiplenme İsteği ❤️</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}