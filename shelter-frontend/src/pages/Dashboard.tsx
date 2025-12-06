
// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("animals");
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

  const bekleyenSayisi = bildirimler.filter(b => b.durum === 'Bekliyor').length;

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

  // --- EN SAĞLAM RESİM URL DÜZELTİCİ ---
  const getImageUrl = (url) => {
    // 1. URL yoksa gri kutu
    if (!url || url === "" || url === "undefined" || url === "null") return "https://placehold.co/100";
    
    // 2. String'e çevir ve boşlukları sil
    let temizUrl = String(url).trim();

    // 3. WINDOWS SLASH (\) SORUNUNU DÜZELT (Ters slashları düze çevir)
    temizUrl = temizUrl.replace(/\\/g, "/");

    // 4. Eğer gerçek bir internet linkiyse (http/https) dokunma, döndür.
    if (temizUrl.startsWith("http://") || temizUrl.startsWith("https://")) {
        return temizUrl;
    }

    // 5. Eğer localhost kalıntısı varsa temizle ve canlı adresi koy
    if (temizUrl.includes("localhost") || temizUrl.includes("127.0.0.1")) {
         return temizUrl.replace(/http:\/\/localhost:\d+/, API_URL).replace(/http:\/\/127.0.0.1:\d+/, API_URL);
    }

    // 6. Eğer başında / varsa kaldır (çift slash olmasın diye)
    if (temizUrl.startsWith("/")) {
        temizUrl = temizUrl.substring(1);
    }

    // 7. Backend adresiyle birleştir
    return `${API_URL}/${temizUrl}`;
  };

  // --- İŞLEMLER ---
  const handleBildirimGuncelle = async (bildirim, yeniDurum) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const hedefHayvanId = bildirim.hayvanId || (bildirim.hayvan && bildirim.hayvan.id);
      if (yeniDurum === 'Onaylandı' && bildirim.tip === 'sahiplenme') {
         const hayvanKontrol = await axios.get(`${API_URL}/hayvan/${hedefHayvanId}`);
         if (hayvanKontrol.data.durum === 'Sahiplendirildi') {
            alert("⚠️ BU HAYVAN BAŞKASINA VERİLDİ! İşlem iptal.");
            window.location.reload(); 
            return;
         }
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
      } else {
        alert(`İşlem: ${yeniDurum}`);
        fetchData(user);
      }
    } catch (error) { alert("Hata oluştu."); } 
    finally { setIsProcessing(false); }
  };

  const handleSave = async (e) => { 
    e.preventDefault(); 
    if(isProcessing)return; 
    setIsProcessing(true); 
    try { 
      let finalResimUrl = formData.resimUrl ? formData.resimUrl.trim() : "";
      
      // Dosya seçilirse yüklemeyi dene ama uyarı ver
      if (selectedFile) { 
        const uploadData = new FormData(); 
        uploadData.append('file', selectedFile); 
        const uploadRes = await axios.post(`${API_URL}/upload`, uploadData); 
        finalResimUrl = uploadRes.data.url; 
      } 
      
      if (!finalResimUrl) finalResimUrl = "https://placehold.co/200";

      const paket = { 
        ad: formData.ad, 
        yas: parseInt(formData.yas), 
        cinsiyet: formData.cinsiyet, 
        durum: formData.durum, 
        resimUrl: finalResimUrl, 
        irk: { id: parseInt(formData.irkId) }, 
        asilar: formData.secilenAsilar.map(id => ({ id: parseInt(id) })) 
      }; 
      if (formData.cipNo) { paket.cip = { numara: formData.cipNo }; } 
      
      if (editingId) { await axios.patch(`${API_URL}/hayvan/${editingId}`, paket); alert("Güncellendi!"); } 
      else { await axios.post(`${API_URL}/hayvan`, paket); alert("Eklendi!"); } 
      
      setIsModalOpen(false); 
      fetchData(user); 
      resetForm(); 
    } catch (error) { 
      console.error(error);
      alert("Hata! İşlem tamamlanamadı."); 
    } finally { setIsProcessing(false); } 
  };

  const handleIhbarGonder = async (e) => { e.preventDefault(); if(isProcessing)return; setIsProcessing(true); await axios.post(`${API_URL}/bildirim`, { tip: 'ihbar', mesaj: ihbarMesaj, gonderenAd: user.fullName, durum: 'Bekliyor' }); alert("İhbar iletildi!"); setIsIhbarOpen(false); setIhbarMesaj(""); fetchData(user); setIsProcessing(false); };
  const handleSahiplenmeIstegi = async (hayvan) => { if (window.confirm(`${hayvan.ad} için istek gönderilsin mi?`)) { if(isProcessing)return; setIsProcessing(true); try { await axios.post(`${API_URL}/bildirim`, { tip: 'sahiplenme', mesaj: `${hayvan.ad} isimli hayvana talibim (ID: ${hayvan.id}).`, gonderenAd: user.fullName, hayvanId: hayvan.id, durum: 'Bekliyor' }); alert("İstek gönderildi!"); fetchData(user); } catch (error) { alert("Hata!"); } finally { setIsProcessing(false); } } };
  const handleBildirimSil = async (id) => { if (window.confirm("Silinsin mi?")) { await axios.delete(`${API_URL}/bildirim/${id}`); fetchData(user); } };
  const handleDelete = async (id) => { if (window.confirm("Silinsin mi?")) { await axios.delete(`${API_URL}/hayvan/${id}`); setHayvanlar(hayvanlar.filter((h) => h.id !== id)); } };
  
  const handleEdit = (hayvan) => { 
      setEditingId(hayvan.id); 
      const mevcutAsiIdleri = hayvan.asilar ? hayvan.asilar.map((a) => a.id.toString()) : []; 
      setFormData({ 
          ad: hayvan.ad, 
          yas: hayvan.yas, 
          cinsiyet: hayvan.cinsiyet, 
          durum: hayvan.durum, 
          resimUrl: hayvan.resimUrl || "", 
          irkId: hayvan.irk ? hayvan.irk.id : "", 
          secilenAsilar: mevcutAsiIdleri, 
          cipNo: hayvan.cip ? hayvan.cip.numara : "" 
      }); 
      setSelectedFile(null); 
      setIsModalOpen(true); 
  };
  
  const handleAddIrk = async () => { const ad = window.prompt("Irk adı:"); if(ad) { await axios.post(`${API_URL}/irk`, { ad }); const r = await axios.get(`${API_URL}/irk`); setIrklar(r.data); } };
  const handleCheckboxChange = (id) => { const s = formData.secilenAsilar; if(s.includes(id)) setFormData({...formData, secilenAsilar: s.filter(x=>x!==id)}); else setFormData({...formData, secilenAsilar: [...s, id]}); };
  const resetForm = () => { setEditingId(null); setSelectedFile(null); setFormData({ ad: "", yas: "", cinsiyet: "Disi", durum: "Sahiplendirilebilir", resimUrl: "", irkId: "", cipNo: "", secilenAsilar: [] }); };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg font-bold text-xl">🐾</div>
            <h1 className="text-xl font-bold text-gray-800">Barınak Paneli</h1>
            {isProcessing && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded animate-pulse">İşlem yapılıyor...</span>}
        </div>
        <div className="flex items-center space-x-4">
            <div className="text-right"><p className="text-sm font-bold text-gray-800">{user.fullName}</p><p className="text-xs text-gray-500 uppercase">{user.role === 'manager' ? 'Yönetici' : 'Gönüllü'}</p></div>
            <button onClick={() => { localStorage.removeItem("user"); navigate("/"); }} disabled={isProcessing} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition">Çıkış</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col space-y-2">
          <button onClick={() => setActiveTab("animals")} className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "animals" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}><span>🐶</span><span>Hayvan Listesi</span></button>
          
          {user.role === 'manager' && (
            <>
              <button onClick={() => setActiveTab("users")} className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "users" ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:bg-gray-50"}`}><span>👥</span><span>Kullanıcılar</span></button>
              <button onClick={() => setActiveTab("bildirimler")} className={`flex justify-between items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "bildirimler" ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-50"}`}>
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

        <main className={`flex-1 p-8 overflow-y-auto ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
          
          {activeTab === "animals" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h3 className="text-gray-400 text-xs font-bold uppercase">Toplam</h3><p className="text-3xl font-bold text-gray-800">{hayvanlar.length}</p></div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h3 className="text-gray-400 text-xs font-bold uppercase">Sahiplendirilebilir</h3><p className="text-3xl font-bold text-green-600">{hayvanlar.filter(h => h.durum === 'Sahiplendirilebilir').length}</p></div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h3 className="text-gray-400 text-xs font-bold uppercase">Tedavide</h3><p className="text-3xl font-bold text-orange-600">{hayvanlar.filter(h => h.durum === 'Tedavide').length}</p></div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center"><h2 className="text-lg font-bold text-gray-800">Hayvan Listesi</h2>{user.role === 'manager' && <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">+ Yeni Hayvan</button>}</div>
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-6 py-4">Resim</th><th className="px-6 py-4">Adı</th><th className="px-6 py-4">Irk</th><th className="px-6 py-4">Çip</th><th className="px-6 py-4">Aşılar</th><th className="px-6 py-4">Durum</th><th className="px-6 py-4 text-right">İşlemler</th></tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {hayvanlar.map((hayvan) => (
                      <tr key={hayvan.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                            {/* RESİM GÖSTERİCİ: Hata olursa konsola basar ve placeholder gösterir */}
                            <div className="flex flex-col items-center">
                                <img 
                                    src={getImageUrl(hayvan.resimUrl)} 
                                    alt={hayvan.ad} 
                                    className="w-10 h-10 rounded-full object-cover border border-gray-200" 
                                    onError={(e) => { 
                                        console.log("RESİM YÜKLENEMEDİ:", hayvan.resimUrl);
                                        e.currentTarget.src = "https://placehold.co/100"; 
                                    }} 
                                />
                            </div>
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

      {isIhbarOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"><div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"><h3 className="font-bold text-lg mb-4 text-gray-800">Sokak Hayvanı Bildir 📢</h3><textarea className="w-full border rounded-lg p-3 text-sm" rows={4} placeholder="Detaylar..." value={ihbarMesaj} onChange={(e) => setIhbarMesaj(e.target.value)} disabled={isProcessing}></textarea><div className="flex justify-end space-x-2 mt-4"><button onClick={() => setIsIhbarOpen(false)} className="text-gray-500" disabled={isProcessing}>İptal</button><button onClick={handleIhbarGonder} className="bg-orange-500 text-white px-4 py-2 rounded" disabled={isProcessing}>Gönder</button></div></div></div>)}
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
            <h3 className="font-bold text-2xl mb-6 text-gray-800">{editingId ? 'Hayvan Düzenle ✏️' : 'Yeni Hayvan Ekle 🐾'}</h3>
            <form onSubmit={handleSave} className="space-y-6">
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
                <label className="block text-xs font-bold text-gray-500 mb-2">Resim Linki (veya Dosya)</label>
                <div className="flex flex-col space-y-3">
                    <input type="text" placeholder="https://..." className="w-full border-gray-300 rounded-lg p-2 text-xs" value={formData.resimUrl} onChange={(e) => setFormData({...formData, resimUrl: e.target.value})} />
                    <div className="text-center text-xs text-gray-400">- veya dosya seç (Geçici) -</div>
                    <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={(e) => setSelectedFile(e.target.files[0])} />
                </div>
                
                {formData.resimUrl && (
                  <div className="mt-4 flex justify-center">
                    <img src={formData.resimUrl} alt="Önizleme" className="h-32 w-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm" onError={(e) => {e.target.style.display = 'none'}} />
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
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition" disabled={isProcessing}>İptal</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg transition transform hover:scale-105" disabled={isProcessing}>{isProcessing ? 'Kaydediliyor...' : 'Kaydet'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
