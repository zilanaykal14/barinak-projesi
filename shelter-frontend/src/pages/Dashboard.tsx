// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// AYIRDIĞIMIZ BİLEŞENLER (Grafik Silindi)
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import AnimalTable from "../components/AnimalTable";
import IhbarModal from "../components/IhbarModal";
import AnimalFormModal from "../components/AnimalFormModal";

export default function Dashboard() {
  const navigate = useNavigate();
  
  // --- STATE VE DEĞİŞKENLER ---
  const [user, setUser] = useState(null); 
  const [activeTab, setActiveTab] = useState("animals");
  const [isProcessing, setIsProcessing] = useState(false);
// const API_URL = "https://barinak-projesi.onrender.com";
// --- AKILLI BACKEND SEÇİCİ ---
  // Eğer tarayıcıda "localhost" yazıyorsa kendi bilgisayarındaki backend'e bağlan (3001 veya 3333).
  // Eğer canlı siteyse (onrender), canlı backend'e bağlan.
  const API_URL = window.location.hostname === "localhost"
    ? "http://localhost:3333"  // Bilgisayarında çalışırken burası devreye girer
    : "https://barinak-projesi.onrender.com"; // Canlıya yüklediğinde burası devreye girer
  const [hayvanlar, setHayvanlar] = useState([]); 
  const [irklar, setIrklar] = useState([]);
  const [asilar, setAsilar] = useState([]);
  const [kullanicilar, setKullanicilar] = useState([]);
  const [bildirimler, setBildirimler] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIhbarOpen, setIsIhbarOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [ihbarMesaj, setIhbarMesaj] = useState("");
  const [formData, setFormData] = useState({
    ad: "", yas: "", cinsiyet: "Disi", durum: "Sahiplendirilebilir", resimUrl: "", irkId: "", cipNo: "", secilenAsilar: []
  });

  // --- SAYFA AÇILIŞI ---
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchData(parsedUser);
    }
  }, []);

  const bekleyenSayisi = bildirimler.filter(b => b.durum === 'Bekliyor').length;

  // --- VERİ ÇEKME ---
  const fetchData = async (currentUser) => {
    try {
      const config = { headers: { "Cache-Control": "no-cache" } };
      const resHayvan = await axios.get(`${API_URL}/hayvan`, config);
      setHayvanlar(resHayvan.data);
      const resIrk = await axios.get(`${API_URL}/irk`);
      setIrklar(resIrk.data);
      const resAsi = await axios.get(`${API_URL}/asi`);
      setAsilar(resAsi.data);
      const resBildirim = await axios.get(`${API_URL}/bildirim`, config);
      setBildirimler(resBildirim.data);

      const role = currentUser ? currentUser.role : user?.role;
      if (role === 'manager') {
        const resUsers = await axios.get(`${API_URL}/users`);
        setKullanicilar(resUsers.data);
      }
    } catch (error) {
      console.error("Veri hatası:", error);
    }
  };

  // --- YARDIMCI FONKSİYONLAR ---
  const getImageUrl = (url) => {
    if (!url || url === "" || url === "null") return "https://placehold.co/100";
    let temizUrl = String(url).trim();
    if (temizUrl.startsWith("http")) return temizUrl;
    const cleanPath = temizUrl.startsWith("/") ? temizUrl.substring(1) : temizUrl;
    return `${API_URL}/${cleanPath}`;
  };

  const handleCheckboxChange = (id) => { const s = formData.secilenAsilar; if(s.includes(id)) setFormData({...formData, secilenAsilar: s.filter(x=>x!==id)}); else setFormData({...formData, secilenAsilar: [...s, id]}); };
  const handleAddIrk = async () => { const ad = window.prompt("Irk adı:"); if(ad) { await axios.post(`${API_URL}/irk`, { ad }); const r = await axios.get(`${API_URL}/irk`); setIrklar(r.data); } };
  
  const resetForm = () => { setEditingId(null); setSelectedFile(null); setFormData({ ad: "", yas: "", cinsiyet: "Disi", durum: "Sahiplendirilebilir", resimUrl: "", irkId: "", cipNo: "", secilenAsilar: [] }); };

  const handleEdit = (hayvan) => { 
      setEditingId(hayvan.id); 
      const mevcutAsiIdleri = hayvan.asilar ? hayvan.asilar.map((a) => a.id.toString()) : []; 
      setFormData({ ad: hayvan.ad, yas: hayvan.yas, cinsiyet: hayvan.cinsiyet, durum: hayvan.durum, resimUrl: hayvan.resimUrl || "", irkId: hayvan.irk ? hayvan.irk.id : "", secilenAsilar: mevcutAsiIdleri, cipNo: hayvan.cip ? hayvan.cip.numara : "" }); 
      setSelectedFile(null); 
      setIsModalOpen(true); 
  };

  // --- ANA İŞLEMLER ---
  const handleBildirimGuncelle = async (bildirim, yeniDurum) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const hedefHayvanId = bildirim.hayvanId || (bildirim.hayvan && bildirim.hayvan.id);
      if (yeniDurum === 'Onaylandı' && bildirim.tip === 'sahiplenme') {
         const hayvanKontrol = await axios.get(`${API_URL}/hayvan/${hedefHayvanId}`);
         if (hayvanKontrol.data.durum === 'Sahiplendirildi') { alert("⚠️ BU HAYVAN BAŞKASINA VERİLDİ! İşlem iptal."); window.location.reload(); return; }
      }
      await axios.patch(`${API_URL}/bildirim/${bildirim.id}`, { durum: yeniDurum });
      if (yeniDurum === 'Onaylandı' && bildirim.tip === 'sahiplenme') {
        await axios.patch(`${API_URL}/hayvan/${hedefHayvanId}`, { durum: 'Sahiplendirildi' });
        const tumIstekler = await axios.get(`${API_URL}/bildirim`);
        const digerleri = tumIstekler.data.filter(b => {
             const bId = b.hayvanId || (b.hayvan && b.hayvan.id);
             return String(bId) === String(hedefHayvanId) && String(b.id) !== String(bildirim.id) && b.durum === 'Bekliyor';
        });
        for (const istek of digerleri) { await axios.patch(`${API_URL}/bildirim/${istek.id}`, { durum: 'Reddedildi' }); }
        alert("✅ İstek onaylandı! Diğerleri reddedildi.");
        window.location.reload();
      } else { alert(`İşlem: ${yeniDurum}`); fetchData(user); }
    } catch (error) { alert("Hata oluştu."); } finally { setIsProcessing(false); }
  };

  const handleSave = async (e) => { 
    e.preventDefault(); 
    if(isProcessing)return; 
    setIsProcessing(true); 
    try { 
      let finalResimUrl = formData.resimUrl ? formData.resimUrl.trim() : "";
      if (selectedFile) { const uploadData = new FormData(); uploadData.append('file', selectedFile); const uploadRes = await axios.post(`${API_URL}/upload`, uploadData); finalResimUrl = uploadRes.data.url; } 
      if (!finalResimUrl) finalResimUrl = "https://placehold.co/200";
      const paket = { ad: formData.ad, yas: parseInt(formData.yas), cinsiyet: formData.cinsiyet, durum: formData.durum, resimUrl: finalResimUrl, irk: { id: parseInt(formData.irkId) }, asilar: formData.secilenAsilar.map(id => ({ id: parseInt(id) })) }; 
      if (formData.cipNo) { paket.cip = { numara: formData.cipNo }; } 
      if (editingId) { await axios.patch(`${API_URL}/hayvan/${editingId}`, paket); alert("Güncellendi!"); } else { await axios.post(`${API_URL}/hayvan`, paket); alert("Eklendi!"); } 
      setIsModalOpen(false); fetchData(user); resetForm(); 
    } catch (error) { console.error(error); alert("Hata!"); } finally { setIsProcessing(false); } 
  };

  const handleIhbarGonder = async (e) => { e.preventDefault(); if(isProcessing)return; setIsProcessing(true); await axios.post(`${API_URL}/bildirim`, { tip: 'ihbar', mesaj: ihbarMesaj, gonderenAd: user.fullName, durum: 'Bekliyor' }); alert("İhbar iletildi!"); setIsIhbarOpen(false); setIhbarMesaj(""); fetchData(user); setIsProcessing(false); };
  const handleSahiplenmeIstegi = async (hayvan) => { if (window.confirm(`${hayvan.ad} için istek gönderilsin mi?`)) { if(isProcessing)return; setIsProcessing(true); try { await axios.post(`${API_URL}/bildirim`, { tip: 'sahiplenme', mesaj: `${hayvan.ad} isimli hayvana talibim (ID: ${hayvan.id}).`, gonderenAd: user.fullName, hayvanId: hayvan.id, durum: 'Bekliyor' }); alert("İstek gönderildi!"); fetchData(user); } catch (error) { alert("Hata!"); } finally { setIsProcessing(false); } } };
  const handleBildirimSil = async (id) => { if (window.confirm("Silinsin mi?")) { await axios.delete(`${API_URL}/bildirim/${id}`); fetchData(user); } };
  const handleDelete = async (id) => { if (window.confirm("Silinsin mi?")) { await axios.delete(`${API_URL}/hayvan/${id}`); setHayvanlar(hayvanlar.filter((h) => h.id !== id)); } };

  if (!user) return null;

  // --- GÖRÜNÜM ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} isProcessing={isProcessing} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          user={user} 
          bekleyenSayisi={bekleyenSayisi} 
          setIsIhbarOpen={setIsIhbarOpen} 
        />

        <main className={`flex-1 p-8 overflow-y-auto ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
          {activeTab === "animals" && (
            <div className="space-y-8">
              {/* İstatistikler */}
              <StatsCards hayvanlar={hayvanlar} />
              
              {/* Tablo */}
              <AnimalTable 
                hayvanlar={hayvanlar}
                user={user}
                getImageUrl={getImageUrl}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleSahiplenmeIstegi={handleSahiplenmeIstegi}
                setIsModalOpen={setIsModalOpen}
                resetForm={resetForm}
              />
            </div>
          )}

          {activeTab === "basvurularim" && user.role === 'volunteer' && (
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100"><h2 className="text-lg font-bold text-gray-800">Başvurularım 📝</h2></div>
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-blue-50 text-xs uppercase text-blue-700"><tr><th className="px-6 py-4">Tür</th><th className="px-6 py-4">Mesaj</th><th className="px-6 py-4">Durum</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                        {bildirimler.filter(b => b.gonderenAd === user.fullName).map((b) => (
                            <tr key={b.id}>
                                <td className="px-6 py-4 uppercase text-xs font-bold text-gray-500">{b.tip}</td>
                                <td className="px-6 py-4">{b.mesaj}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${b.durum === 'Onaylandı' ? 'bg-green-100 text-green-700' : b.durum === 'Reddedildi' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.durum}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          )}

          {activeTab === "bildirimler" && user.role === 'manager' && (
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100"><h2 className="text-lg font-bold text-gray-800">Gelen İstekler 🔔 ({bekleyenSayisi})</h2></div>
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-orange-50 text-xs uppercase text-orange-700"><tr><th className="px-6 py-4">Durum</th><th className="px-6 py-4">Tür</th><th className="px-6 py-4">Gönderen</th><th className="px-6 py-4">Mesaj</th><th className="px-6 py-4 text-right">İşlem</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {bildirimler.map((b) => (
                    <tr key={b.id} className={b.durum === 'Bekliyor' ? 'bg-orange-50' : 'bg-white'}>
                      <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${b.durum === 'Onaylandı' ? 'bg-green-100 text-green-700' : b.durum === 'Reddedildi' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.durum}</span></td>
                      <td className="px-6 py-4 font-bold text-xs uppercase text-gray-500">{b.tip}</td>
                      <td className="px-6 py-4 font-medium">{b.gonderenAd}</td>
                      <td className="px-6 py-4">{b.mesaj}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {b.durum === 'Bekliyor' && (
                          <>{b.tip === 'sahiplenme' && <button onClick={() => handleBildirimGuncelle(b, 'Onaylandı')} className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700" disabled={isProcessing}>Onayla</button>}
                          {b.tip === 'ihbar' && <button onClick={() => handleBildirimGuncelle(b, 'Okundu')} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700" disabled={isProcessing}>Okundu</button>}
                          <button onClick={() => handleBildirimGuncelle(b, 'Reddedildi')} className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600" disabled={isProcessing}>Reddet</button></>
                        )}
                        <button onClick={() => handleBildirimSil(b.id)} className="bg-gray-200 text-gray-600 px-3 py-1 rounded text-xs hover:bg-gray-300" disabled={isProcessing}>Sil</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === "sahiplenenler" && user.role === 'manager' && (
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"><div className="p-6 border-b border-gray-100"><h2 className="text-lg font-bold text-gray-800">Sahiplenenler 🏠</h2></div><table className="w-full text-left text-sm text-gray-600"><thead className="bg-green-50 text-xs uppercase text-green-700"><tr><th className="px-6 py-4">Sahiplenen Kişi</th><th className="px-6 py-4">Mesaj / Detay</th><th className="px-6 py-4">Durum</th></tr></thead><tbody className="divide-y divide-gray-100">{bildirimler.filter(b => b.tip === 'sahiplenme' && b.durum === 'Onaylandı').map((b) => (<tr key={b.id}><td className="px-6 py-4 font-bold text-gray-800">{b.gonderenAd}</td><td className="px-6 py-4">{b.mesaj}</td><td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">Sahiplendi</span></td></tr>))}</tbody></table></div>
          )}
          
          {activeTab === "users" && user.role === 'manager' && (
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100"><h2 className="text-lg font-bold text-gray-800">Kullanıcılar</h2></div>
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-purple-50 text-xs uppercase text-purple-700"><tr><th className="px-6 py-4">Ad Soyad</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Rol</th></tr></thead>
                <tbody className="divide-y divide-gray-100">{kullanicilar.map((k) => (<tr key={k.id}><td className="px-6 py-4 font-bold">{k.fullName}</td><td className="px-6 py-4">{k.email}</td><td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs uppercase">{k.role}</span></td></tr>))}</tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      <IhbarModal 
        isOpen={isIhbarOpen} 
        onClose={() => setIsIhbarOpen(false)}
        onSend={handleIhbarGonder}
        message={ihbarMesaj}
        setMessage={setIhbarMesaj}
        isProcessing={isProcessing}
      />

      <AnimalFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
        irklar={irklar}
        asilar={asilar}
        handleAddIrk={handleAddIrk}
        handleCheckboxChange={handleCheckboxChange}
        setSelectedFile={setSelectedFile}
        getImageUrl={getImageUrl}
        isProcessing={isProcessing}
      />
    </div>
  );
}