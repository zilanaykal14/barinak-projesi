
// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("animals");
  
  // İŞLEM KİLİDİ (Ekranda görünmez ama çakışmayı engeller)
  const [isProcessing, setIsProcessing] = useState(false);

  // CANLI BACKEND ADRESİ
  const API_URL = "https://barinak-projesi.onrender.com";

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

  // --- BEKLEYEN BİLDİRİM SAYISI ---
  const bekleyenSayisi = bildirimler.filter(b => b.durum === 'Bekliyor').length;

  const fetchData = async (currentUser) => {
    try {
      const resHayvan = await axios.get(`${API_URL}/hayvan`);
      setHayvanlar(resHayvan.data);
      const resIrk = await axios.get(`${API_URL}/irk`);
      setIrklar(resIrk.data);
      const resAsi = await axios.get(`${API_URL}/asi`);
      setAsilar(resAsi.data);
      const resBildirim = await axios.get(`${API_URL}/bildirim`);
      setBildirimler(resBildirim.data);

      const role = currentUser ? currentUser.role : user?.role;
      if (role === 'manager') {
        const resUsers = await axios.get(`${API_URL}/users`);
        setKullanicilar(resUsers.data);
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  };

  // --- RESİM DÜZELTME MOTORU ---
  const getImageUrl = (url) => {
    if (!url) return "https://placehold.co/100";
    const strUrl = String(url);
    if (strUrl.includes("uploads") || strUrl.includes("127.0.0.1") || strUrl.includes("localhost")) {
      const parcalar = strUrl.split("uploads");
      const dosyaAdi = parcalar[parcalar.length - 1].replace(/\\/g, "/");
      const temizYol = dosyaAdi.startsWith('/') ? dosyaAdi : '/' + dosyaAdi;
      return `${API_URL}/uploads${temizYol}`;
    }
    if (strUrl.startsWith("http")) return strUrl;
    return `${API_URL}${strUrl}`;
  };

  // --- GÜVENLİK KONTROLLÜ ONAY SİSTEMİ ---
  const handleBildirimGuncelle = async (bildirim, yeniDurum) => {
    if (isProcessing) return; // Zaten işlem yapılıyorsa dur
    setIsProcessing(true); // Kilitle

    try {
      const hedefHayvanId = bildirim.hayvanId || (bildirim.hayvan && bildirim.hayvan.id);

      // 1. ÖNCE HAYVAN BOŞ MU DİYE BAK
      if (yeniDurum === 'Onaylandı' && bildirim.tip === 'sahiplenme') {
         const hayvanKontrol = await axios.get(`${API_URL}/hayvan/${hedefHayvanId}`);
         if (hayvanKontrol.data.durum === 'Sahiplendirildi') {
            alert("⚠️ BU HAYVAN BAŞKASINA VERİLDİ! İşlem iptal ediliyor.");
            window.location.reload(); 
            return;
         }
      }

      await axios.patch(`${API_URL}/bildirim/${bildirim.id}`, { durum: yeniDurum });

      if (yeniDurum === 'Onaylandı' && bildirim.tip === 'sahiplenme') {
        await axios.patch(`${API_URL}/hayvan/${hedefHayvanId}`, { durum: 'Sahiplendirildi' });
        
        // Diğerlerini bul ve reddet
        const tumIstekler = await axios.get(`${API_URL}/bildirim`);
        const digerleri = tumIstekler.data.filter(b => {
             const bId = b.hayvanId || (b.hayvan && b.hayvan.id);
             return String(bId) === String(hedefHayvanId) && String(b.id) !== String(bildirim.id) && b.durum === 'Bekliyor';
        });

        for (const istek of digerleri) {
           await axios.patch(`${API_URL}/bildirim/${istek.id}`, { durum: 'Reddedildi' });
        }

        alert("✅ ONAYLANDI! Diğer bekleyen istekler otomatik reddedildi.");
        window.location.reload();
      } else {
        alert(`İşlem: ${yeniDurum}`);
        fetchData(user);
      }
    } catch (error) { 
        alert("Hata oluştu."); 
    } finally {
        setIsProcessing(false); // Kilidi aç
    }
  };

  // Diğer fonksiyonlar (Aynı mantıkla kilit eklendi)
  const handleSave = async (e) => { e.preventDefault(); if(isProcessing)return; setIsProcessing(true); try { let finalResimUrl = formData.resimUrl; if (selectedFile) { const uploadData = new FormData(); uploadData.append('file', selectedFile); const uploadRes = await axios.post(`${API_URL}/upload`, uploadData); finalResimUrl = uploadRes.data.url; } const paket = { ad: formData.ad, yas: parseInt(formData.yas), cinsiyet: formData.cinsiyet, durum: formData.durum, resimUrl: finalResimUrl || "https://placehold.co/200", irk: { id: parseInt(formData.irkId) }, asilar: formData.secilenAsilar.map(id => ({ id: parseInt(id) })) }; if (formData.cipNo) { paket.cip = { numara: formData.cipNo }; } if (editingId) { await axios.patch(`${API_URL}/hayvan/${editingId}`, paket); alert("Güncellendi!"); } else { await axios.post(`${API_URL}/hayvan`, paket); alert("Eklendi!"); } setIsModalOpen(false); fetchData(user); resetForm(); } catch (error) { alert("Hata!"); } finally { setIsProcessing(false); } };
  const handleIhbarGonder = async (e) => { e.preventDefault(); if(isProcessing)return; setIsProcessing(true); await axios.post(`${API_URL}/bildirim`, { tip: 'ihbar', mesaj: ihbarMesaj, gonderenAd: user.fullName, durum: 'Bekliyor' }); alert("İhbar iletildi!"); setIsIhbarOpen(false); setIhbarMesaj(""); fetchData(user); setIsProcessing(false); };
  const handleSahiplenmeIstegi = async (hayvan) => { if (window.confirm(`${hayvan.ad} için istek gönderilsin mi?`)) { if(isProcessing)return; setIsProcessing(true); try { await axios.post(`${API_URL}/bildirim`, { tip: 'sahiplenme', mesaj: `${hayvan.ad} isimli hayvana talibim (ID: ${hayvan.id}).`, gonderenAd: user.fullName, hayvanId: hayvan.id, durum: 'Bekliyor' }); alert("İstek gönderildi!"); fetchData(user); } catch (error) { alert("Hata!"); } finally { setIsProcessing(false); } } };
  const handleBildirimSil = async (id) => { if (window.confirm("Silinsin mi?")) { await axios.delete(`${API_URL}/bildirim/${id}`); fetchData(user); } };
  const handleDelete = async (id) => { if (window.confirm("Silinsin mi?")) { await axios.delete(`${API_URL}/hayvan/${id}`); setHayvanlar(hayvanlar.filter((h) => h.id !== id)); } };
  const handleAddIrk = async () => { const ad = window.prompt("Irk adı:"); if(ad) { await axios.post(`${API_URL}/irk`, { ad }); const r = await axios.get(`${API_URL}/irk`); setIrklar(r.data); } };
  const handleCheckboxChange = (id) => { const s = formData.secilenAsilar; if(s.includes(id)) setFormData({...formData, secilenAsilar: s.filter(x=>x!==id)}); else setFormData({...formData, secilenAsilar: [...s, id]}); };
  const resetForm = () => { setEditingId(null); setSelectedFile(null); setFormData({ ad: "", yas: "", cinsiyet: "Disi", durum: "Sahiplendirilebilir", resimUrl: "", irkId: "", cipNo: "", secilenAsilar: [] }); };
  const handleEdit = (hayvan) => { setEditingId(hayvan.id); const mevcutAsiIdleri = hayvan.asilar ? hayvan.asilar.map((a) => a.id.toString()) : []; setFormData({ ad: hayvan.ad, yas: hayvan.yas, cinsiyet: hayvan.cinsiyet, durum: hayvan.durum, resimUrl: hayvan.resimUrl || "", irkId: hayvan.irk ? hayvan.irk.id : "", secilenAsilar: mevcutAsiIdleri, cipNo: hayvan.cip ? hayvan.cip.numara : "" }); setSelectedFile(null); setIsModalOpen(true); };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center relative">
        <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg font-bold text-xl">🐾</div>
            <h1 className="text-xl font-bold text-gray-800">Barınak Paneli</h1>
            {isProcessing && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded ml-2 animate-pulse">İşlem yapılıyor...</span>}
        </div>
        <div className="flex items-center space-x-4">
            <div className="text-right">
                <p className="text-sm font-bold text-gray-800">{user.fullName}</p>
                <p className="text-xs text-gray-500 uppercase">{user.role === 'manager' ? 'Yönetici' : 'Gönüllü'}</p>
            </div>
            <button onClick={() => { localStorage.removeItem("user"); navigate("/"); }} disabled={isProcessing} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition">Çıkış</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR (ESKİ TASARIM) */}
        <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col space-y-2">
          <button onClick={() => setActiveTab("animals")} className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "animals" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}><span>🐶</span><span>Hayvan Listesi</span></button>
          {user.role === 'manager' && (
            <>
              <button onClick={() => setActiveTab("users")} className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "users" ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:bg-gray-50"}`}><span>👥</span><span>Kullanıcılar</span></button>
              
              {/* BİLDİRİM IŞIKLI BUTON */}
              <button onClick={() => setActiveTab("bildirimler")} className={`flex justify-between items-center px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "bildirimler" ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-50"}`}>
                  <div className="flex items-center space-x-3"><span>🔔</span><span>Gelen İstekler</span></div>
                  {bekleyenSayisi > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{bekleyenSayisi}</span>}
              </button>

              <button onClick={() => setActiveTab("sahiplenenler")} className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "sahiplenenler" ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"}`}><span>🏠</span><span>Sahiplenenler</span></button>
            </>
          )}
          {user.role === 'volunteer' && (
            <>
              <button onClick={() => setActiveTab("basvurularim")} className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "basvurularim" ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"}`}><span>📝</span><span>Başvurularım</span></button>
              <button onClick={() => setIsIhbarOpen(true)} className="mt-4 bg-orange-500 text-white px-4 py-3 rounded-lg text-sm font-bold hover:bg-orange-600 shadow-md">📢 Sokak Hayvanı Bildir</button>
            </>
          )}
        </aside>

        {/* MAIN CONTENT */}
        <main className={`flex-1 p-8 overflow-y-auto ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
          {activeTab === "animals" && (
            <div className="space-y-8">
              {/* İstatistik Kartları */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h3 className="text-gray-400 text-xs font-bold uppercase">Toplam</h3><p className="text-3xl font-bold text-gray-800">{hayvanlar.length}</p></div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h3 className="text-gray-400 text-xs font-bold uppercase">Sahiplendirilebilir</h3><p className="text-3xl font-bold text-green-600">{hayvanlar.filter(h => h.durum === 'Sahiplendirilebilir').length}</p></div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h3 className="text-gray-400 text-xs font-bold uppercase">Tedavide</h3><p className="text-3xl font-bold text-orange-600">{hayvanlar.filter(h => h.durum === 'Tedavide').length}</p></div>
              </div>
              
              {/* Tablo */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center"><h2 className="text-lg font-bold text-gray-800">Hayvan Listesi</h2>{user.role === 'manager' && <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">+ Yeni Hayvan</button>}</div>
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-6 py-4">Resim</th><th className="px-6 py-4">Adı</th><th className="px-6 py-4">Irk</th><th className="px-6 py-4">Çip</th><th className="px-6 py-4">Aşılar</th><th className="px-6 py-4">Durum</th><th className="px-6 py-4 text-right">İşlemler</th></tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {hayvanlar.map((hayvan) => (
                      <tr key={hayvan.id} className="hover:bg-gray-50">
                        {/* RESİM GÖSTERME (FİXLİ) */}
                        <td className="px-6 py-4">
                            <img src={getImageUrl(hayvan.resimUrl)} alt={hayvan.ad} className="w-10 h-10 rounded-full object-cover border border-gray-200" onError={(e) => { e.currentTarget.src = "https://placehold.co/100"; }} />
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">{hayvan.ad}</td>
                        <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{hayvan.irk ? hayvan.irk.ad : '-'}</span></td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{hayvan.cip ? hayvan.cip.numara : '-'}</td>
                        <td className="px-6 py-4"><div className="flex flex-wrap gap-1">{hayvan.asilar?.map((asi) => <span key={asi.id} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{asi.ad}</span>)}</div></td>
                        <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${hayvan.durum === 'Tedavide' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>{hayvan.durum}</span></td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {user.role === 'manager' ? (
                            <><button onClick={() => handleEdit(hayvan)} className="text-blue-600 hover:text-blue-900 font-medium">Düzenle</button><button onClick={() => handleDelete(hayvan.id)} className="text-red-600 hover:text-red-900 font-medium">Sil</button></>
                          ) : (hayvan.durum === 'Sahiplendirilebilir' && <button onClick={() => handleSahiplenmeIstegi(hayvan)} className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition shadow">Sahiplenme İsteği ❤️</button>)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
          {activeTab === "bildirimler" && user.role === 'manager' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100"><h2 className="text-lg font-bold text-gray-800">Gelen İstekler 🔔</h2></div>
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
                          <>{b.tip === 'sahiplenme' && <button onClick={() => handleBildirimGuncelle(b, 'Onaylandı')} className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">Onayla</button>}
                          {b.tip === 'ihbar' && <button onClick={() => handleBildirimGuncelle(b, 'Okundu')} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">Okundu</button>}
                          <button onClick={() => handleBildirimGuncelle(b, 'Reddedildi')} className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600">Reddet</button></>
                        )}
                        <button onClick={() => handleBildirimSil(b.id)} className="bg-gray-200 text-gray-600 px-3 py-1 rounded text-xs hover:bg-gray-300">Sil</button>
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
          {activeTab === "basvurularim" && user.role === 'volunteer' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"><div className="p-6 border-b border-gray-100"><h2 className="text-lg font-bold text-gray-800">Başvurularım 📝</h2></div><table className="w-full text-left text-sm text-gray-600"><thead className="bg-blue-50 text-xs uppercase text-blue-700"><tr><th className="px-6 py-4">Tür</th><th className="px-6 py-4">Mesaj</th><th className="px-6 py-4">Yönetici Cevabı</th></tr></thead><tbody className="divide-y divide-gray-100">{bildirimler.filter(b => b.gonderenAd === user.fullName).map((b) => (<tr key={b.id}><td className="px-6 py-4 uppercase text-xs font-bold text-gray-500">{b.tip}</td><td className="px-6 py-4">{b.mesaj}</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${b.durum === 'Onaylandı' ? 'bg-green-100 text-green-700' : b.durum === 'Reddedildi' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.durum}</span></td></tr>))}</tbody></table></div>
          )}
        </main>
      </div>
      {isIhbarOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"><div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"><h3 className="font-bold text-lg mb-4 text-gray-800">Sokak Hayvanı Bildir 📢</h3><textarea className="w-full border rounded-lg p-3 text-sm" rows={4} placeholder="Detaylar..." value={ihbarMesaj} onChange={(e) => setIhbarMesaj(e.target.value)}></textarea><div className="flex justify-end space-x-2 mt-4"><button onClick={() => setIsIhbarOpen(false)} className="text-gray-500">İptal</button><button onClick={handleIhbarGonder} className="bg-orange-500 text-white px-4 py-2 rounded">Gönder</button></div></div></div>)}
      {isModalOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"><div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"><div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50"><h3 className="font-bold text-gray-800">{editingId ? 'Düzenle' : 'Yeni Ekle'}</h3><button onClick={() => setIsModalOpen(false)}>✕</button></div><form onSubmit={handleSave} className="p-6 space-y-4"><input type="text" placeholder="Ad" required className="w-full border rounded px-3 py-2" value={formData.ad} onChange={e => setFormData({...formData, ad: e.target.value})} /><input type="file" accept="image/*" className="w-full border rounded px-3 py-2 text-sm" onChange={(e) => { if(e.target.files?.[0]) setSelectedFile(e.target.files[0]) }} /><div><div className="flex justify-between mb-1"><label className="text-sm">Irk</label><button type="button" onClick={handleAddIrk} className="text-xs text-blue-600">+ Yeni Irk</button></div><select required className="w-full border rounded px-3 py-2 bg-white" value={formData.irkId} onChange={e => setFormData({...formData, irkId: e.target.value})}><option value="">Seçiniz...</option>{irklar.map(irk => <option key={irk.id} value={irk.id}>{irk.ad}</option>)}</select></div><div><label className="text-sm">Mikroçip No (Varsa)</label><input type="text" placeholder="TR-..." className="w-full border rounded px-3 py-2" value={formData.cipNo} onChange={e => setFormData({...formData, cipNo: e.target.value})} /></div><div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded border">{asilar.map(asi => (<label key={asi.id} className="flex items-center space-x-2"><input type="checkbox" checked={formData.secilenAsilar.includes(asi.id.toString())} onChange={() => handleCheckboxChange(asi.id.toString())} /><span className="text-sm">{asi.ad}</span></label>))}</div><div className="grid grid-cols-2 gap-4"><input type="number" placeholder="Yaş" required className="w-full border rounded px-3 py-2" value={formData.yas} onChange={e => setFormData({...formData, yas: e.target.value})} /><select className="w-full border rounded px-3 py-2 bg-white" value={formData.cinsiyet} onChange={e => setFormData({...formData, cinsiyet: e.target.value})}><option value="Disi">Dişi</option><option value="Erkek">Erkek</option></select></div><select className="w-full border rounded px-3 py-2 bg-white" value={formData.durum} onChange={e => setFormData({...formData, durum: e.target.value})}><option value="Sahiplendirilebilir">Sahiplendirilebilir</option><option value="Tedavide">Tedavide</option><option value="Sahiplendirildi">Sahiplendirildi</option></select><button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">{editingId ? 'Güncelle' : 'Kaydet'}</button></form></div></div>)}
    </div>
  );
}
// deneme 