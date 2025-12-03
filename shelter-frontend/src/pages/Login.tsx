import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  
  // Hangi ekrandayız? (false: Giriş, true: Kayıt Ol)
  const [isRegistering, setIsRegistering] = useState(false);

  // Form Verileri
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); // Sadece kayıt için gerekli

  // --- GİRİŞ YAPMA FONKSİYONU ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Backend'den kullanıcıları çek
      const response = await axios.get("http://127.0.0.1:3333/users");
      const users = response.data;

      // Email ve Şifre eşleşiyor mu?
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard");
      } else {
        alert("Hatalı Email veya Şifre!");
      }
    } catch (error) {
      console.error("Giriş Hatası:", error);
      alert("Sunucuya bağlanılamadı! (Port 3333)");
    }
  };

  // --- KAYIT OLMA FONKSİYONU ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Backend'e yeni kullanıcı gönder
      const newUser = {
        fullName: fullName,
        email: email,
        password: password,
        role: "volunteer" // Yeni kayıt olanlar otomatik Gönüllü olsun
      };

      await axios.post("http://127.0.0.1:3333/users", newUser);
      
      alert("Kayıt Başarılı! Şimdi giriş yapabilirsiniz. 🎉");
      setIsRegistering(false); // Giriş ekranına geri dön
      
    } catch (error) {
      console.error("Kayıt Hatası:", error);
      alert("Kayıt olurken hata oluştu. Email daha önce alınmış olabilir.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isRegistering ? "Yeni Hesap Oluştur 📝" : "Barınak Giriş 🐶"}
        </h2>
        
        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
          
          {/* Sadece Kayıt Ekranındaysa Ad Soyad Göster */}
          {isRegistering && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Ad Soyad</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Adınız Soyadınız"
                required
              />
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Email Adresi</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ornek@barinak.com"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Şifre</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••"
              required
            />
          </div>

          <button 
            type="submit"
            className={`w-full px-4 py-2 text-white rounded-lg transition duration-200 font-bold ${
              isRegistering ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isRegistering ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </form>

        {/* Geçiş Linki */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {isRegistering ? "Zaten hesabınız var mı?" : "Hesabınız yok mu?"}
          </p>
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              // Formu temizle
              setEmail(""); setPassword(""); setFullName("");
            }}
            className="text-blue-600 hover:underline font-medium text-sm mt-1"
          >
            {isRegistering ? "Giriş Yap" : "Hemen Kayıt Ol"}
          </button>
        </div>

      </div>
    </div>
  );
}