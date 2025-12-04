
// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("animals");
  
  // İŞLEM SIRASINDA EKRANI KİLİTLEMEK İÇİN YENİ DURUM
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

  // --- KIRMIZI BİLDİRİM IŞIĞI (Bekleyen Sayısı) ---
  const bekleyenSayisi = bildirimler.filter(b => b.durum === 'Bekliyor').length;

  const fetchData = async (currentUser) => {
    try {
      // Verileri çekerken önbelleği (cache) devre dışı bırakıyoruz
      const config = { headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" } };
      
      const [resHayvan, resIrk, resAsi, resBildirim] = await Promise.all([
        axios.get(`${API_URL}/hayvan`, config),
        axios.get(`${API_URL}/irk`, config),
        axios.get(`${API_URL}/asi`, config),
        axios.get(`${API_URL}/bildirim`, config)
      ]);

      setHayvanlar(resHayvan.data);
      setIrklar(resIrk.data);
      setAsilar(resAsi.data);
      setBildirimler(resBildirim.data);
      
      const role = currentUser ? currentUser.role : user?.role;
      if (role === 'manager') {
        const resUsers = await axios.get(`${API_URL}/users`, config);
        setKullanicilar(resUsers.data);
      }
    } catch (error) { console.error("Veri çekme hatası:", error); }
  };

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

  // --- KİLİTLİ ONAY SİSTEMİ (ÇİFTE TIKLAMAYI ENGELLER) ---
  const handleBildirimGuncelle = async (bildirim, yeniDurum) => {
    // Eğer zaten bir işlem yapılıyorsa butona basmayı engelle
    if (isProcessing) return;
    
    // KİLİTLE
    setIsProcessing(true);

    try {
      const hedefHayvanId = bildirim.hayvanId || (bildirim.hayvan && bildirim.hayvan.id);

      // 1. SON KONTROL: Sunucudan hayvanın güncel durumunu sor (Cache kapalı)
      if (yeniDurum === 'Onaylandı' && bildirim.tip === 'sahiplenme') {
         const hayvanKontrol = await axios.get(`${API_URL}/hayvan/${hedefHayvanId}`, { 
             headers: { "Cache-Control": "no-cache" } 
         });
         
         if (hayvanKontrol.data.durum === 'Sahiplendirildi') {
            alert("❌ HATA: Bu hayvan işlem sırasında başkasına verildi!");
            window.location.reload();
            return;
         }
      }

      // 2. İşlemi Yap
      await axios.patch(`${API_URL}/bildirim/${bildirim.id}`, { durum: yeniDurum });

      // 3. Onay sonrası temizlik
      if (yeniDurum === 'Onaylandı' && bildirim.tip === 'sahiplenme') {
        await axios.patch(`${API_URL}/hayvan/${hedefHayvanId}`, { durum: 'Sahiplendirildi' });
        
        // Güncel listeyi çekip filtrele (Daha güvenli)
        const guncelBildirimler = await axios.get(`${API_URL}/bildirim`);
        const digerleri = guncelBildirimler.data.filter(b => {
             const bId = b.hayvanId || (b.hayvan && b.hayvan.id);
             return String(bId) === String(hedefHayvanId) && 
                    String(b.id) !== String(bildirim.id) && 
                    b.durum === 'Bekliyor';
        });

        for (const istek of digerleri) {
           await axios.patch(`${API_URL}/bildirim/${istek.id}`, { durum: 'Reddedildi' });
        }

        alert("✅ İşlem Başarılı! Diğer istekler otomatik reddedildi.");
        window.location.reload(); 
      } else {
        alert(`Durum güncellendi: ${yeniDurum}`);
        fetchData(user);
      }

    } catch (error) { 
        console.error(error);
        alert("Bir hata oluştu."); 
    } finally {
        // İşlem bitince KİLİDİ AÇ
        setIsProcessing(false);
    }
  };

  // Diğer fonksiyonlarda da kilitleme kullanıyoruz
  const handleSave = async (e) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      let finalResimUrl = formData.resimUrl;
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);
        const uploadRes = await axios.post(`${API_URL}/upload`, uploadData);
        finalResimUrl = uploadRes.data.url;
      }
      const paket = {
        ad: formData.ad, yas: parseInt(formData.yas), cinsiyet: formData.cinsiyet, durum: formData.durum,
        resimUrl: finalResimUrl || "", irk: { id: parseInt(formData.irkId) }, asilar: formData.secilenAsilar.map(id => ({ id: parseInt(id) }))
      };
      if (formData.cipNo) paket.cip = { numara: formData.cipNo };

      if (editingId) await axios.patch(`${API_URL}/hayvan/${editingId}`, paket);
      else await axios.post(`${API_URL}/hayvan`, paket);
      
      setIsModalOpen(false); fetchData(user); resetForm(); alert("Kaydedildi!");
    } catch (error) { alert("Hata!"); } finally { setIsProcessing(false); }
  };

  // Yardımcı fonksiyonlar
  const handleIhbarGonder = async (e) => { e.preventDefault(); if(isProcessing)return; setIsProcessing(true); await axios.post(`${API_URL}/bildirim`, { tip: 'ihbar', mesaj: ihbarMesaj, gonderenAd: user.fullName, durum: 'Bekliyor' }); setIsIhbarOpen(false); fetchData(user); setIsProcessing(false); };
  const handleSahiplenmeIstegi = async (hayvan) => { if(confirm("İstek gönderilsin mi?")) { if(isProcessing)return; setIsProcessing(true); await axios.post(`${API_URL}/bildirim`, { tip: 'sahiplenme', mesaj: `Talibim: ${hayvan.ad}`, gonderenAd: user.fullName, hayvanId: hayvan.id, durum: 'Bekliyor' }); alert("Gönderildi!"); fetchData(user); setIsProcessing(false); }};
  const handleBildirimSil = async (id) => { if(confirm("Silinsin mi?")) { if(isProcessing)return; setIsProcessing(true); await axios.delete(`${API_URL}/bildirim/${id}`); fetchData(user); setIsProcessing(false); }};
  const handleDelete = async (id) => { if(confirm("Silinsin mi?")) { if(isProcessing)return; setIsProcessing(true); await axios.delete(`${API_URL}/hayvan/${id}`); setHayvanlar(hayvanlar.filter(h=>h.id!==id)); setIsProcessing(false); }};
  const handleEdit = (h) => { setEditingId(h.id); setFormData({ ad: h.ad, yas: h.yas, cinsiyet: h.cinsiyet, durum: h.durum, resimUrl: h.resimUrl||"", irkId: h.irk?.id||"", secilenAsilar: h.asilar?.map(a=>a.id.toString())||[], cipNo: h.cip?.numara||"" }); setIsModalOpen(true); };
  const resetForm = () => { setEditingId(null); setSelectedFile(null); setFormData({ ad: "", yas: "", cinsiyet: "Disi", durum: "Sahiplendirilebilir", resimUrl: "", irkId: "", cipNo: "", secilenAsilar: [] }); };
  const handleAddIrk = async () => { const ad = prompt("Irk:"); if(ad) { await axios.post(`${API_URL}/irk`, {ad}); const r = await axios.get(`${API_URL}/irk`); setIrklar(r.data); }};
  const handleCheckboxChange = (id) => { const s = formData.secilenAsilar; setFormData({...formData, secilenAsilar: s.includes(id)?s.filter(x=>x!==id):[...s, id]}); };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="px-8 py-4 bg-white border-b flex justify-between items-center shadow-sm relative">
        <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">🐾 Barınak Paneli</h1>
            {isProcessing && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded animate-pulse">İşlem Yapılıyor...</span>}
        </div>
        <button onClick={()=>{localStorage.removeItem("user"); navigate("/");}} className="text-red-600 font-bold" disabled={isProcessing}>Çıkış</button>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r p-4 space-y-2">
            <button onClick={()=>setActiveTab("animals")} className={`block w-full text-left p-3 rounded transition ${activeTab==='animals'?'bg-blue-50 text-blue-600':'hover:bg-gray-100'}`} disabled={isProcessing}>🐶 Hayvanlar</button>
            {user.role === 'manager' && <>
                <button onClick={()=>setActiveTab("users")} className={`block w-full text-left p-3 rounded transition ${activeTab==='users'?'bg-purple-50 text-purple-600':'hover:bg-gray-100'}`} disabled={isProcessing}>👥 Kullanıcılar</button>
                
                {/* --- KIRMIZI BİLDİRİM IŞIĞI --- */}
                <button onClick={()=>setActiveTab("bildirimler")} className={`flex justify-between items-center w-full text-left p-3 rounded transition ${activeTab==='bildirimler'?'bg-orange-50 text-orange-600':'hover:bg-gray-100'}`} disabled={isProcessing}>
                    <span>🔔 İstekler</span>
                    {bekleyenSayisi > 0 && <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">{bekleyenSayisi}</span>}
                </button>
                {/* ----------------------------- */}

            </>}
            {user.role === 'volunteer' && <button onClick={()=>setIsIhbarOpen(true)} className="w-full bg-orange-500 text-white p-2 rounded mt-4" disabled={isProcessing}>Sokak Hayvanı Bildir</button>}
        </aside>
        <main className={`flex-1 p-8 overflow-auto ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Main content - opacity düşürülerek kilitlendiği belli edilir */}
            {activeTab === "animals" && <div>
                <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">Hayvan Listesi</h2> {user.role==='manager' && <button onClick={()=>{resetForm(); setIsModalOpen(true)}} className="bg-blue-600 text-white px-4 py-2 rounded">+ Yeni</button>}</div>
                <div className="grid grid-cols-1 gap-4">
                    {hayvanlar.map(h => (
                        <div key={h.id} className="bg-white p-4 rounded shadow flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src={getImageUrl(h.resimUrl)} className="w-16 h-16 object-cover rounded" onError={e=>e.currentTarget.src="https://placehold.co/100"} />
                                <div><h3 className="font-bold">{h.ad}</h3> <span className="text-sm text-gray-500">{h.irk?.ad} - {h.durum}</span></div>
                            </div>
                            <div className="space-x-2">
                                {user.role==='manager' ? <><button onClick={()=>handleEdit(h)} className="text-blue-600">Düzenle</button> <button onClick={()=>handleDelete(h.id)} className="text-red-600">Sil</button></> : h.durum==='Sahiplendirilebilir' && <button onClick={()=>handleSahiplenmeIstegi(h)} className="bg-green-600 text-white px-3 py-1 rounded">Sahiplen</button>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>}

            {activeTab === "bildirimler" && user.role === 'manager' && <div>
                <h2 className="text-xl font-bold mb-4">Gelen İstekler ({bekleyenSayisi})</h2>
                {bildirimler.map(b => (
                    <div key={b.id} className={`p-4 mb-2 rounded shadow flex justify-between items-center ${b.durum==='Bekliyor'?'bg-orange-50 border-l-4 border-orange-500':'bg-white opacity-70'}`}>
                        <div><span className={`font-bold ${b.durum==='Bekliyor'?'text-orange-600':b.durum==='Onaylandı'?'text-green-600':'text-red-600'}`}>{b.durum}</span> - {b.tip} - {b.gonderenAd}: {b.mesaj}</div>
                        {b.durum === 'Bekliyor' && <div className="space-x-2">
                            <button onClick={()=>handleBildirimGuncelle(b, 'Onaylandı')} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 shadow" disabled={isProcessing}>Onayla</button>
                            <button onClick={()=>handleBildirimGuncelle(b, 'Reddedildi')} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 shadow" disabled={isProcessing}>Reddet</button>
                        </div>}
                        {b.durum !== 'Bekliyor' && <button onClick={()=>handleBildirimSil(b.id)} className="text-gray-400 text-sm hover:text-red-500" disabled={isProcessing}>Sil</button>}
                    </div>
                ))}
            </div>}
            
            {activeTab === "users" && user.role === 'manager' && <div>
                <h2 className="text-xl font-bold mb-4">Kullanıcılar</h2>
                {kullanicilar.map(k => <div key={k.id} className="bg-white p-2 border-b">{k.fullName} - {k.role}</div>)}
            </div>}
        </main>
      </div>

      {/* MODALLAR */}
      {isModalOpen && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <form onSubmit={handleSave} className="bg-white p-6 rounded w-96 space-y-4 shadow-xl">
            <h3 className="font-bold">Hayvan Ekle/Düzenle</h3>
            <input placeholder="Ad" value={formData.ad} onChange={e=>setFormData({...formData, ad:e.target.value})} className="border p-2 w-full" required disabled={isProcessing}/>
            <input type="file" onChange={e=>setSelectedFile(e.target.files[0])} className="border p-2 w-full" disabled={isProcessing}/>
            <div className="flex gap-2"><select value={formData.irkId} onChange={e=>setFormData({...formData, irkId:e.target.value})} className="border p-2 w-full" required disabled={isProcessing}><option value="">Irk Seç</option>{irklar.map(i=><option key={i.id} value={i.id}>{i.ad}</option>)}</select> <button type="button" onClick={handleAddIrk} className="text-blue-600 text-sm" disabled={isProcessing}>+Irk</button></div>
            <input placeholder="Yaş" type="number" value={formData.yas} onChange={e=>setFormData({...formData, yas:e.target.value})} className="border p-2 w-full" required disabled={isProcessing}/>
            <select value={formData.durum} onChange={e=>setFormData({...formData, durum:e.target.value})} className="border p-2 w-full" disabled={isProcessing}><option>Sahiplendirilebilir</option><option>Tedavide</option><option>Sahiplendirildi</option></select>
            <div className="flex justify-end gap-2"><button type="button" onClick={()=>setIsModalOpen(false)} className="text-gray-500" disabled={isProcessing}>İptal</button> <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={isProcessing}>{isProcessing ? '...' : 'Kaydet'}</button></div>
        </form>
      </div>}
      
      {isIhbarOpen && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded w-96 shadow-xl">
            <h3>Sokak Hayvanı Bildir</h3>
            <textarea className="border w-full p-2 mt-2" rows={4} value={ihbarMesaj} onChange={e=>setIhbarMesaj(e.target.value)} disabled={isProcessing}></textarea>
            <div className="flex justify-end gap-2 mt-2"><button onClick={()=>setIsIhbarOpen(false)} disabled={isProcessing}>İptal</button> <button onClick={handleIhbarGonder} className="bg-orange-500 text-white px-4 py-2 rounded" disabled={isProcessing}>Gönder</button></div>
        </div>
      </div>}
    </div>
  );
}
