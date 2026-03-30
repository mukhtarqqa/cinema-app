import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User as UserIcon, Phone, Smartphone } from 'lucide-react';

export const Login = () => {
  const [authMethod, setAuthMethod] = useState('email'); // 'email' немесе 'phone'
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmResult, setConfirmResult] = useState(null);

  const { loginEmail, registerEmail, loginPhone } = useAuth();
  const navigate = useNavigate();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) await registerEmail(email, password, name);
      else await loginEmail(email, password);
      navigate('/');
    } catch (error) { alert(error.message); }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await loginPhone(phoneNumber, 'recaptcha-container');
      setConfirmResult(res);
    } catch (error) { alert(error.message); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await confirmResult.confirm(otp);
      navigate('/');
    } catch (error) { alert("Қате код"); }
  };

  return (
    <div className="min-h-screen pt-32 px-6 flex justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-[#1a1a1a] border border-white/10 p-8 rounded-[2.5rem] h-fit">
        <div className="flex gap-4 mb-8 bg-white/5 p-1 rounded-2xl">
          <button onClick={() => setAuthMethod('email')} className={`flex-1 py-2 rounded-xl transition-all ${authMethod === 'email' ? 'bg-[#ff4d00] text-white' : 'text-white/40'}`}>Email</button>
          <button onClick={() => setAuthMethod('phone')} className={`flex-1 py-2 rounded-xl transition-all ${authMethod === 'phone' ? 'bg-[#ff4d00] text-white' : 'text-white/40'}`}>Телефон</button>
        </div>

        {authMethod === 'email' ? (
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <h2 className="text-2xl font-bold uppercase mb-4">{isRegister ? 'Тіркелу' : 'Кіру'}</h2>
            {isRegister && (
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input type="text" placeholder="Атыңыз" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#ff4d00]" required />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#ff4d00]" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input type="password" placeholder="Құпия сөз" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#ff4d00]" required />
            </div>
            <button type="submit" className="w-full bg-[#ff4d00] text-white py-4 rounded-2xl font-bold uppercase tracking-widest">{isRegister ? 'Тіркелу' : 'Кіру'}</button>
            <button type="button" onClick={() => setIsRegister(!isRegister)} className="w-full text-white/40 text-xs mt-2 uppercase">{isRegister ? 'Аккаунтыңыз бар ма?' : 'Аккаунт жоқ па?'}</button>
          </form>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold uppercase mb-4">Телефонмен кіру</h2>
            {!confirmResult ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input type="tel" placeholder="+7 700 000 0000" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#ff4d00]" required />
                </div>
                <div id="recaptcha-container"></div>
                <button type="submit" className="w-full bg-[#ff4d00] text-white py-4 rounded-2xl font-bold uppercase tracking-widest">SMS жіберу</button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input type="text" placeholder="SMS код" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#ff4d00]" required />
                </div>
                <button type="submit" className="w-full bg-white text-black py-4 rounded-2xl font-bold uppercase tracking-widest">Растау</button>
              </form>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
