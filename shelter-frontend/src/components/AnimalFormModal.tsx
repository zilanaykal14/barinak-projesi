// @ts-nocheck
import React from 'react';

interface AnimalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: any) => void;
  editingId: number | null;
  formData: any;
  setFormData: (data: any) => void;
  irklar: any[];
  asilar: any[];
  handleAddIrk: () => void;
  handleCheckboxChange: (id: string) => void;
  setSelectedFile: (file: any) => void;
  getImageUrl: (url: string) => string;
  isProcessing: boolean;
}

export default function AnimalFormModal({ 
  isOpen, onClose, onSave, editingId, formData, setFormData, 
  irklar, asilar, handleAddIrk, handleCheckboxChange, 
  setSelectedFile, getImageUrl, isProcessing 
}: AnimalFormModalProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
        <h3 className="font-bold text-2xl mb-6 text-gray-800">{editingId ? 'Hayvan Düzenle ✏️' : 'Yeni Hayvan Ekle 🐾'}</h3>
        
        <form onSubmit={onSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-xs font-bold text-gray-500 mb-1">Adı</label><input type="text" required className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" value={formData.ad} onChange={(e) => setFormData({...formData, ad: e.target.value})} /></div>
            <div><label className="block text-xs font-bold text-gray-500 mb-1">Yaş</label><input type="number" required className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50" value={formData.yas} onChange={(e) => setFormData({...formData, yas: e.target.value})} /></div>
            <div><label className="block text-xs font-bold text-gray-500 mb-1">Cinsiyet</label><select className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50" value={formData.cinsiyet} onChange={(e) => setFormData({...formData, cinsiyet: e.target.value})}><option value="Disi">Dişi</option><option value="Erkek">Erkek</option></select></div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Irk</label>
              <div className="flex gap-2">
                <select required className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50" value={formData.irkId} onChange={(e) => setFormData({...formData, irkId: e.target.value})}>
                  <option value="">Seçiniz</option>
                  {irklar.map((irk) => (<option key={irk.id} value={irk.id}>{irk.ad}</option>))}
                </select>
                <button type="button" onClick={handleAddIrk} className="bg-gray-200 hover:bg-gray-300 px-3 rounded-lg text-lg font-bold">+</button>
              </div>
            </div>
            <div><label className="block text-xs font-bold text-gray-500 mb-1">Durum</label><select className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50" value={formData.durum} onChange={(e) => setFormData({...formData, durum: e.target.value})}><option value="Sahiplendirilebilir">Sahiplendirilebilir</option><option value="Tedavide">Tedavide</option><option value="Sahiplendirildi">Sahiplendirildi</option><option value="Kayıp">Kayıp</option></select></div>
            <div><label className="block text-xs font-bold text-gray-500 mb-1">Çip No</label><input type="text" className="w-full border-gray-300 rounded-lg p-2.5 bg-gray-50" placeholder="Opsiyonel" value={formData.cipNo} onChange={(e) => setFormData({...formData, cipNo: e.target.value})} /></div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <label className="block text-sm font-bold text-red-600 mb-2">RESİM LİNKİNİ BURAYA YAPIŞTIR 👇</label>
            <input type="text" placeholder="https://..." className="w-full border-2 border-blue-200 rounded-lg p-3 text-sm focus:border-blue-500 mb-3" value={formData.resimUrl} onChange={(e) => setFormData({...formData, resimUrl: e.target.value})} />
            
            <div className="text-center text-xs text-gray-400 mb-2">- VEYA BİLGİSAYARDAN SEÇ -</div>
            <input type="file" className="w-full text-sm text-gray-500" onChange={(e) => setSelectedFile(e.target.files[0])} />

            {formData.resimUrl && (
              <div className="mt-4 flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-1">Önizleme:</div>
                <img src={getImageUrl(formData.resimUrl)} alt="Önizleme" className="h-32 w-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm" onError={(e) => {e.target.style.display = 'none'}} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">Yapılan Aşılar</label>
            <div className="flex flex-wrap gap-3">
              {asilar.map((asi) => (
                <label key={asi.id} className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border shadow-sm cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" checked={formData.secilenAsilar.includes(asi.id.toString())} onChange={() => handleCheckboxChange(asi.id.toString())} />
                  <span className="text-sm text-gray-700">{asi.ad}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition" disabled={isProcessing}>İptal</button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg transition transform hover:scale-105" disabled={isProcessing}>{isProcessing ? 'Kaydediliyor...' : 'Kaydet'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}