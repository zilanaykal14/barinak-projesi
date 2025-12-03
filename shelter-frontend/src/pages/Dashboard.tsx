

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
  // Varsayılan sekme
  const [activeTab, setActiveTab] = useState("animals");

  // Veri Depoları
  const [hayvanlar, setHayvanlar] = useState<any[]>([]); 
  const [irklar, setIrklar] = useState<any[]>([]);
  const [asilar, setAsilar] = useState<any[]>([]);
  const [kullanicilar, setKullanicilar] = useState<any[]>([]);
  const [bildirimler, setBildirimler] = useState<any[]>([]);

  // UI Kontrolleri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIhbarOpen, setIsIhbarOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // İhbar Formu Verisi
  const [ihbarMesaj, setIhbarMesaj] = useState("");

  // Hayvan Ekleme/Güncelleme Form Verisi
  const [formData, setFormData] = useState({
    ad: "",
    yas: "",
    cinsiyet: "Disi",
    durum: "Sahiplendirilebilir",
    resimUrl: "",
    irkId: "",
    cipNo: "", // 1:1 İlişki (Mikroçip)
    secilenAsilar: [] as string[] // N:M İlişki (Aşılar)
  });

  // 1. Sayfa Yüklenirken Giriş Kontrolü
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

  // 2. Tüm Verileri Çeken Fonksiyon
  const fetchData = async (currentUser?: any) => {
    try {
      // Herkesin görebileceği veriler
      const resHayvan = await axios.get("http://127.0.0.1:3333/hayvan");
      setHayvanlar(resHayvan.data);

      const resIrk = await axios.get("http://127.0.0.1:3333/irk");
      setIrklar(resIrk.data);

      const resAsi = await axios.get("http://127.0.0.1:3333/asi");
      setAsilar(resAsi.data);

      // Bildirimleri çek (Filtreleme aşağıda yapılacak)
      const resBildirim = await axios.get("http://127.0.0.1:3333/bildirim");
      setBildirimler(resBildirim.data);

      // Sadece Yönetici verileri
      const role = currentUser ? currentUser.role : user?.role;
      if (role === 'manager') {
        const resUsers = await axios.get("http://127.0.0.1:3333/users");
        setKullanicilar(resUsers.data);
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  };

  // --- İHBAR GÖNDERME (GÖNÜLLÜ) ---
  const handleIhbarGonder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:3333/bildirim", {
        tip: 'ihbar',
        mesaj: ihbarMesaj,
        gonderenAd: user.fullName,
        durum: 'Bekliyor'
      });
      alert("İhbarınız yöneticiye iletildi! Teşekkürler 🐾");
      setIsIhbarOpen(false);
      setIhbarMesaj("");
      fetchData(user);
    } catch (error) {
      alert("Hata oluştu.");
    }
  };

  // --- SAHİPLENME İSTEĞİ (GÖNÜLLÜ) ---
  const handleSahiplenmeIstegi = async (hayvan: any) => {
    if (window.confirm(`${hayvan.ad} isimli dostumuzu sahiplenmek için istek gönderilsin mi?`)) {
      try {
        await axios.post("http://127.0.0.1:3333/bildirim", {
          tip: 'sahiplenme',
          mesaj: `${hayvan.ad} isimli hayvana talibim (ID: ${hayvan.id}).`,
          gonderenAd: user.fullName,
          hayvanId: hayvan.id,
          durum: 'Bekliyor'
        });
        alert("İsteğiniz gönderildi! Yönetici yanıtı 'Başvurularım' sekmesine düşecektir.");
        fetchData(user);
      } catch (error) {
        alert("Hata oluştu.");
      }
    }
  };

  // --- BİLDİRİM GÜNCELLEME (YÖNETİCİ) ---
  const handleBildirimGuncelle = async (bildirim: any, yeniDurum: string) => {
    try {
      // 1. Bildirim durumunu güncelle
      await axios.patch(`http://127.0.0.1:3333/bildirim/${bildirim.id}`, { durum: yeniDurum });

      // 2. Eğer onaylanan bir sahiplenme ise hayvanı da güncelle
      if (yeniDurum === 'Onaylandı' && bildirim.tip === 'sahiplenme' && bildirim.hayvanId) {
        await axios.patch(`http://127.0.0.1:3333/hayvan/${bildirim.hayvanId}`, { durum: 'Sahiplendirildi' });
      }

      alert(`İşlem yapıldı: ${yeniDurum}`);
      fetchData(user);
    } catch (error) {
      alert("Hata oluştu.");
    }
  };

  const handleBildirimSil = async (id: number) => {
    if (window.confirm("Bildirimi silmek istiyor musunuz?")) {
      await axios.delete(`http://127.0.0.1:3333/bildirim/${id}`);
      fetchData(user);
    }
  };

  // --- HAYVAN KAYDETME (RESİM + 1:1 ÇİP + N:M AŞI + 1:N IRK) ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let finalResimUrl = formData.resimUrl;

      // 1. Dosya varsa önce yükle
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);
        const uploadRes = await axios.post("http://127.0.0.1:3333/upload", uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalResimUrl = uploadRes.data.url;
      }

      // 2. Veri Paketini Hazırla
      const paket: any = {
        ad: formData.ad,
        yas: parseInt(formData.yas),
        cinsiyet: formData.cinsiyet,
        durum: formData.durum,
        resimUrl: finalResimUrl || "https://placehold.co/200",
        irk: { id: parseInt(formData.irkId) }, // 1:N İlişki
        asilar: formData.secilenAsilar.map(id => ({ id: parseInt(id) })) // N:M İlişki
      };

      // 3. Mikroçip varsa pakete ekle (1:1 İlişki)
      if (formData.cipNo) {
        paket.cip = { numara: formData.cipNo };
      }

      // 4. Gönder (Ekle veya Güncelle)
      if (editingId) {
        await axios.patch(`http://127.0.0.1:3333/hayvan/${editingId}`, paket);
        alert("Kayıt güncellendi! ✅");
      } else {
        await axios.post("http://127.0.0.1:3333/hayvan", paket);
        alert("Yeni hayvan eklendi! 🐾");
      }
      
      setIsModalOpen(false);
      fetchData(user);
      resetForm();

    } catch (error) {
      console.error("İşlem hatası:", error);
      alert("Hata oluştu! Alanları (veya çip numarasının benzersizliğini) kontrol edin.");
    }
  };

  const handleEdit = (hayvan: any) => {
    setEditingId(hayvan.id);
    const mevcutAsiIdleri = hayvan.asilar ? hayvan.asilar.map((a: any) => a.id.toString()) : [];
    
    setFormData({
      ad: hayvan.ad,
      yas: hayvan.yas,
      cinsiyet: hayvan.cinsiyet,
      durum: hayvan.durum,
      resimUrl: hayvan.resimUrl || "",
      irkId: hayvan.irk ? hayvan.irk.id : "",
      secilenAsilar: mevcutAsiIdleri,
      cipNo: hayvan.cip ? hayvan.cip.numara : "" // Çip numarasını getir
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`http://127.0.0.1:3333/hayvan/${id}`);
        setHayvanlar(hayvanlar.filter((h) => h.id !== id));
      } catch (error) {
        alert("Silinemedi!");
      }
    }
  };

  const handleAddIrk = async () => {
    const ad = window.prompt("Yeni Irk Adı:");
    if (ad) {
      try {
        await axios.post("http://127.0.0.1:3333/irk", { ad });
        const res = await axios.get("http://127.0.0.1:3333/irk");
        setIrklar(res.data);
      } catch (error) { alert("Hata!"); }
    }
  };

  const handleCheckboxChange = (id: string) => {
    const s = formData.secilenAsilar;
    if (s.includes(id)) setFormData({...formData, secilenAsilar: s.filter(x => x !== id)});
    else setFormData({...formData, secilenAsilar: [...s, id]});
  };

  const resetForm = () => {
    setEditingId(null);
    setSelectedFile(null);
    setFormData({ ad: "", yas: "", cinsiyet: "Disi", durum: "Sahiplendirilebilir", resimUrl: "", irkId: "", cipNo: "", secilenAsilar: [] });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg font-bold text-xl">🐾</div>
          <h1 className="text-xl font-bold text-gray-800">Barınak Paneli</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-800">{user.fullName}</p>
            <p className="text-xs text-gray-500 uppercase">{user.role === 'manager' ? 'Yönetici' : 'Gönüllü'}</p>
          </div>
          <button onClick={() => { localStorage.removeItem("user"); navigate("/"); }} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition">Çıkış</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* YAN MENÜ */}
        <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col space-y-2">
          <button onClick={() => setActiveTab("animals")} className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "animals" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}><span>🐶</span><span>Hayvan Listesi</span></button>
          
          {/* YÖNETİCİ BUTONLARI */}
          {user.role === 'manager' && (
            <>
              <button onClick={() => setActiveTab("users")} className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "users" ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:bg-gray-50"}`}><span>👥</span><span>Kullanıcılar</span></button>
              <button onClick={() => setActiveTab("bildirimler")} className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "bildirimler" ? "bg-orange-50 text-orange-700" : "text-gray-600 hover:bg-gray-50"}`}>
                <span>🔔</span><span>Gelen İstekler</span>
                {bildirimler.filter(b => b.durum === 'Bekliyor').length > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 rounded-full">{bildirimler.filter(b => b.durum === 'Bekliyor').length}</span>}
              </button>
              <button onClick={() => setActiveTab("sahiplenenler")} className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "sahiplenenler" ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"}`}><span>🏠</span><span>Sahiplenenler</span></button>
            </>
          )}

          {/* GÖNÜLLÜ BUTONLARI */}
          {user.role === 'volunteer' && (
            <>
              <button onClick={() => setActiveTab("basvurularim")} className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "basvurularim" ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"}`}><span>📝</span><span>Başvurularım</span></button>
              <button onClick={() => setIsIhbarOpen(true)} className="mt-4 bg-orange-500 text-white px-4 py-3 rounded-lg text-sm font-bold hover:bg-orange-600 shadow-md">📢 Sokak Hayvanı Bildir</button>
            </>
          )}
        </aside>

        {/* ANA İÇERİK ALANI */}
        <main className="flex-1 p-8 overflow-y-auto">
          
          {/* 1. HAYVANLAR SEKME */}
          {activeTab === "animals" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h3 className="text-gray-400 text-xs font-bold uppercase">Toplam</h3><p className="text-3xl font-bold text-gray-800">{hayvanlar.length}</p></div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h3 className="text-gray-400 text-xs font-bold uppercase">Sahiplendirilebilir</h3><p className="text-3xl font-bold text-green-600">{hayvanlar.filter(h => h.durum === 'Sahiplendirilebilir').length}</p></div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h3 className="text-gray-400 text-xs font-bold uppercase">Tedavide</h3><p className="text-3xl font-bold text-orange-600">{hayvanlar.filter(h => h.durum === 'Tedavide').length}</p></div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-800">Hayvan Listesi</h2>
                  {user.role === 'manager' && <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">+ Yeni Hayvan</button>}
                </div>
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-6 py-4">Resim</th><th className="px-6 py-4">Adı</th><th className="px-6 py-4">Irk</th><th className="px-6 py-4">Çip</th><th className="px-6 py-4">Aşılar</th><th className="px-6 py-4">Durum</th><th className="px-6 py-4 text-right">İşlemler</th></tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {hayvanlar.map((hayvan) => (
                      <tr key={hayvan.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4"><img src={hayvan.resimUrl || "https://placehold.co/100"} alt={hayvan.ad} className="w-10 h-10 rounded-full object-cover border border-gray-200" /></td>
                        <td className="px-6 py-4 font-bold text-gray-900">{hayvan.ad}</td>
                        <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{hayvan.irk ? hayvan.irk.ad : '-'}</span></td>
                        {/* MİKROÇİP ALANI */}
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{hayvan.cip ? hayvan.cip.numara : '-'}</td>
                        <td className="px-6 py-4"><div className="flex flex-wrap gap-1">{hayvan.asilar?.map((asi:any) => <span key={asi.id} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{asi.ad}</span>)}</div></td>
                        <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${hayvan.durum === 'Tedavide' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>{hayvan.durum}</span></td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {user.role === 'manager' ? (
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
            </div>
          )}

          {/* 2. KULLANICILAR SEKME */}
          {activeTab === "users" && user.role === 'manager' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100"><h2 className="text-lg font-bold text-gray-800">Kullanıcılar</h2></div>
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-purple-50 text-xs uppercase text-purple-700"><tr><th className="px-6 py-4">Ad Soyad</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Rol</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {kullanicilar.map((k) => (<tr key={k.id}><td className="px-6 py-4 font-bold">{k.fullName}</td><td className="px-6 py-4">{k.email}</td><td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs uppercase">{k.role}</span></td></tr>))}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. BİLDİRİMLER SEKME (YÖNETİCİ) */}
          {activeTab === "bildirimler" && user.role === 'manager' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100"><h2 className="text-lg font-bold text-gray-800">Gelen Bildirimler & İstekler 🔔</h2></div>
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
                          <>
                            {b.tip === 'sahiplenme' && <button onClick={() => handleBildirimGuncelle(b, 'Onaylandı')} className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">Onayla</button>}
                            {b.tip === 'ihbar' && <button onClick={() => handleBildirimGuncelle(b, 'Okundu')} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">Okundu</button>}
                            <button onClick={() => handleBildirimGuncelle(b, 'Reddedildi')} className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600">Reddet</button>
                          </>
                        )}
                        <button onClick={() => handleBildirimSil(b.id)} className="bg-gray-200 text-gray-600 px-3 py-1 rounded text-xs hover:bg-gray-300">Sil</button>
                      </td>
                    </tr>
                  ))}
                  {bildirimler.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-gray-400">Yeni bildirim yok.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* 4. SAHİPLENENLER LİSTESİ (YÖNETİCİ) */}
          {activeTab === "sahiplenenler" && user.role === 'manager' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100"><h2 className="text-lg font-bold text-gray-800">Sahiplenenler Listesi 🏠</h2></div>
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-green-50 text-xs uppercase text-green-700"><tr><th className="px-6 py-4">Sahiplenen Kişi</th><th className="px-6 py-4">Mesaj / Detay</th><th className="px-6 py-4">Durum</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {bildirimler.filter(b => b.tip === 'sahiplenme' && b.durum === 'Onaylandı').map((b) => (
                    <tr key={b.id}>
                      <td className="px-6 py-4 font-bold text-gray-800">{b.gonderenAd}</td>
                      <td className="px-6 py-4">{b.mesaj}</td>
                      <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">Sahiplendi</span></td>
                    </tr>
                  ))}
                  {bildirimler.filter(b => b.tip === 'sahiplenme' && b.durum === 'Onaylandı').length === 0 && <tr><td colSpan={3} className="text-center py-8 text-gray-400">Henüz sahiplenilen hayvan yok.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* 5. BAŞVURULARIM (GÖNÜLLÜ) */}
          {activeTab === "basvurularim" && user.role === 'volunteer' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100"><h2 className="text-lg font-bold text-gray-800">Başvurularım & İhbarlarım 📝</h2></div>
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-blue-50 text-xs uppercase text-blue-700"><tr><th className="px-6 py-4">Tür</th><th className="px-6 py-4">Mesaj</th><th className="px-6 py-4">Yönetici Cevabı</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {bildirimler.filter(b => b.gonderenAd === user.fullName).map((b) => (
                    <tr key={b.id}>
                      <td className="px-6 py-4 uppercase text-xs font-bold text-gray-500">{b.tip}</td>
                      <td className="px-6 py-4">{b.mesaj}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${b.durum === 'Onaylandı' ? 'bg-green-100 text-green-700' : b.durum === 'Reddedildi' ? 'bg-red-100 text-red-700' : b.durum === 'Okundu' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {b.durum}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {bildirimler.filter(b => b.gonderenAd === user.fullName).length === 0 && <tr><td colSpan={3} className="text-center py-8 text-gray-400">Henüz bir işlem yapmadınız.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* İHBAR MODALI */}
      {isIhbarOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"><div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"><h3 className="font-bold text-lg mb-4 text-gray-800">Sokak Hayvanı Bildir 📢</h3><textarea className="w-full border rounded-lg p-3 text-sm" rows={4} placeholder="Detaylar..." value={ihbarMesaj} onChange={(e) => setIhbarMesaj(e.target.value)}></textarea><div className="flex justify-end space-x-2 mt-4"><button onClick={() => setIsIhbarOpen(false)} className="text-gray-500">İptal</button><button onClick={handleIhbarGonder} className="bg-orange-500 text-white px-4 py-2 rounded">Gönder</button></div></div></div>)}

      {/* HAYVAN EKLEME/DÜZENLEME MODALI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50"><h3 className="font-bold text-gray-800">{editingId ? 'Düzenle' : 'Yeni Ekle'}</h3><button onClick={() => setIsModalOpen(false)}>✕</button></div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <input type="text" placeholder="Ad" required className="w-full border rounded px-3 py-2" value={formData.ad} onChange={e => setFormData({...formData, ad: e.target.value})} />
              <input type="file" accept="image/*" className="w-full border rounded px-3 py-2 text-sm" onChange={(e) => { if(e.target.files?.[0]) setSelectedFile(e.target.files[0]) }} />
              <div><div className="flex justify-between mb-1"><label className="text-sm">Irk</label><button type="button" onClick={handleAddIrk} className="text-xs text-blue-600">+ Yeni Irk</button></div><select required className="w-full border rounded px-3 py-2 bg-white" value={formData.irkId} onChange={e => setFormData({...formData, irkId: e.target.value})}><option value="">Seçiniz...</option>{irklar.map(irk => <option key={irk.id} value={irk.id}>{irk.ad}</option>)}</select></div>
              <div><label className="text-sm">Mikroçip No (Varsa)</label><input type="text" placeholder="TR-..." className="w-full border rounded px-3 py-2" value={formData.cipNo} onChange={e => setFormData({...formData, cipNo: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded border">{asilar.map(asi => (<label key={asi.id} className="flex items-center space-x-2"><input type="checkbox" checked={formData.secilenAsilar.includes(asi.id.toString())} onChange={() => handleCheckboxChange(asi.id.toString())} /><span className="text-sm">{asi.ad}</span></label>))}</div>
              <div className="grid grid-cols-2 gap-4"><input type="number" placeholder="Yaş" required className="w-full border rounded px-3 py-2" value={formData.yas} onChange={e => setFormData({...formData, yas: e.target.value})} /><select className="w-full border rounded px-3 py-2 bg-white" value={formData.cinsiyet} onChange={e => setFormData({...formData, cinsiyet: e.target.value})}><option value="Disi">Dişi</option><option value="Erkek">Erkek</option></select></div><select className="w-full border rounded px-3 py-2 bg-white" value={formData.durum} onChange={e => setFormData({...formData, durum: e.target.value})}><option value="Sahiplendirilebilir">Sahiplendirilebilir</option><option value="Tedavide">Tedavide</option><option value="Sahiplendirildi">Sahiplendirildi</option></select>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">{editingId ? 'Güncelle' : 'Kaydet'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}