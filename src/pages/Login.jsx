import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Phone, Smartphone, ChevronLeft, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [view, setView] = useState('email'); // 'email', 'phone', 'forgot'
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '', otp: '' });
  const [confirmResult, setConfirmResult] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const { loginEmail, registerEmail, loginPhone, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (view === 'forgot') {
        await resetPassword(formData.email);
        setMessage({ text: 'Парольді қалпына келтіру сілтемесі поштаңызға жіберілді!', type: 'success' });
        setTimeout(() => setView('email'), 3000);
      } else if (isRegister) {
        await registerEmail(formData.email, formData.password, formData.name);
        setMessage({ text: 'Тіркелу сәтті! Поштаңызды растауды ұмытпаңыз.', type: 'success' });
      } else {
        await loginEmail(formData.email, formData.password);
        navigate('/');
      }
    } catch (err) { setMessage({ text: err.message, type: 'error' }); }
  };

  const handlePhoneSign = async (e) => {
    e.preventDefault();
    try {
      if (!confirmResult) {
        const res = await loginPhone(formData.phone, 'recaptcha-box');
        setConfirmResult(res);
        setMessage({ text: 'SMS код жіберілді', type: 'success' });
      } else {
        await confirmResult.confirm(formData.otp);
        navigate('/');
      }
    } catch (err) { setMessage({ text: 'Қате: ' + err.message, type: 'error' }); }
  };

  return (
    <div className="min-h-screen pt-32 px-6 flex justify-center bg-black">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-[#111] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative">
        
        {/* ХАБАРЛАМАЛАР */}
        <AnimatePresence>
          {message.text && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} 
              className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              <AlertCircle size={18} /> {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* НАВИГАЦИЯ */}
        <div className="flex items-center justify-between mb-8">
          {view !== 'email' ? (
            <button onClick={() => { setView('email'); setConfirmResult(null); }} className="p-2 bg-white/5 rounded-full hover:bg-white/10"><ChevronLeft size={20}/></button>
          ) : <div className="w-9" />}
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            {view === 'forgot' ? 'Парольді қалпына келтіру' : view === 'phone' ? 'Телефонмен кіру' : isRegister ? 'Тіркелу' : 'Кіру'}
          </h2>
          <div className="w-9" />
        </div>

        {view === 'email' || view === 'forgot' ? (
          <form onSubmit={handleAuth} className="space-y-4">
            {isRegister && view === 'email' && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input type="text" placeholder="Атыңыз" required className="auth-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input type="email" placeholder="Email" required className="auth-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            {view !== 'forgot' && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input type="password" placeholder="Құпия сөз" required className="auth-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            )}
            
            <button type="submit" className="w-full bg-[#ff4d00] text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
              {view === 'forgot' ? 'Жіберу' : isRegister ? 'Тіркелу' : 'Кіру'}
            </button>

            {view === 'email' && !isRegister && (
              <button type="button" onClick={() => setView('forgot')} className="w-full text-xs text-white/30 hover:text-white uppercase tracking-widest mt-2">Парольді ұмыттыңыз ба?</button>
            )}
            
            <div className="flex flex-col gap-3 mt-4">
              <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-sm text-white/50 hover:text-white">
                {isRegister ? 'Аккаунтыңыз бар ма? Кіру' : 'Аккаунт жоқ па? Тіркелу'}
              </button>
              {!isRegister && (
                <button type="button" onClick={() => setView('phone')} className="text-sm text-[#ff4d00] font-bold">ТЕЛЕФОН АРҚЫЛЫ КІРУ</button>
              )}
            </div>
          </form>
        ) : (
          <form onSubmit={handlePhoneSign} className="space-y-4">
            {!confirmResult ? (
              <>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input type="tel" placeholder="+7 700 000 0000" required className="auth-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                {/* CAPTCHA CONTAINER */}
                <div id="recaptcha-box" className="flex justify-center my-4 overflow-hidden rounded-xl"></div>
                <button type="submit" className="w-full bg-[#ff4d00] text-white py-4 rounded-2xl font-bold uppercase tracking-widest">SMS жіберу</button>
              </>
            ) : (
              <>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input type="text" placeholder="SMS код" required className="auth-input" value={formData.otp} onChange={e => setFormData({...formData, otp: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-white text-black py-4 rounded-2xl font-bold uppercase tracking-widest">Растау</button>
              </>
            )}
          </form>
        )}
      </motion.div>
      
      <style>{`
        .auth-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 1rem;
          padding: 1rem 1rem 1rem 3rem;
          outline: none;
          transition: all 0.2s;
        }
        .auth-input:focus {
          border-color: #ff4d00;
          background: rgba(255,255,255,0.08);
        }
      `}</style>
    </div>
  );
};
