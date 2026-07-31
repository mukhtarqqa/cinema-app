import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ChevronLeft, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [view, setView] = useState('email');
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  const { loginEmail, registerEmail, loginGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    try {
      if (view === 'forgot') {
        await resetPassword(formData.email);
        setMessage({ text: 'Сілтеме поштаңызға жіберілді!', type: 'success' });
        setTimeout(() => setView('email'), 3000);
      } else if (isRegister) {
        await registerEmail(formData.email, formData.password, formData.name);
        setMessage({ text: 'Тіркелу сәтті! Поштаңызды растаңыз.', type: 'success' });
      } else {
        await loginEmail(formData.email, formData.password);
        navigate('/');
      }
    } catch (err) { 
      setMessage({ text: 'Қате: ' + err.message, type: 'error' }); 
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginGoogle();
      navigate('/');
    } catch (err) {
      console.error('Google login error:', err);
      setMessage({ text: 'Google арқылы кіру сәтсіз аяқталды', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 flex justify-center bg-[#050505] text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="max-w-md w-full bg-[#0f0f0f] border border-white/5 p-8 rounded-[2rem] shadow-2xl self-center"
      >
        <AnimatePresence>
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}
            >
              <AlertCircle size={18} /> {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-10">
          {view === 'forgot' ? (
            <button onClick={() => setView('email')} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
              <ChevronLeft size={20}/>
            </button>
          ) : <div className="w-9" />}
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            {view === 'forgot' ? 'Қалпына келтіру' : isRegister ? 'Тіркелу' : 'Кіру'}
          </h2>
          <div className="w-9" />
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isRegister && view === 'email' && (
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#ff4d00] transition-colors" size={20} />
              <input type="text" placeholder="Атыңыз" required className="auth-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
          )}
          
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#ff4d00] transition-colors" size={20} />
            <input type="email" placeholder="Email" required className="auth-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          {view !== 'forgot' && (
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#ff4d00] transition-colors" size={20} />
              <input type="password" placeholder="Құпия сөз" required className="auth-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
          )}

          <button type="submit" className="w-full bg-[#ff4d00] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[#ff4d00]/20">
            {view === 'forgot' ? 'Жіберу' : isRegister ? 'Тіркелу' : 'Кіру'}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-4">
          {!isRegister && view === 'email' && (
            <button type="button" onClick={() => setView('forgot')} className="text-[10px] text-white/20 hover:text-white/50 uppercase tracking-[0.2em] transition-colors">
              Құпия сөзді ұмыттыңыз ба?
            </button>
          )}

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-[10px] text-white/20 uppercase tracking-widest">Немесе</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-all"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="google" />
            Google арқылы
          </button>

          <button 
            type="button" 
            onClick={() => setIsRegister(!isRegister)} 
            className="text-sm text-white/40 hover:text-white transition-colors mt-2"
          >
            {isRegister ? 'Аккаунтыңыз бар ма? Кіру' : 'Аккаунт жоқ па? Тіркелу'}
          </button>
        </div>
      </motion.div>

      <style>{`
        .auth-input {
          width: 100%;
          background: #151515;
          border: 1px solid rgba(255,255,255,0.03);
          border-radius: 0.85rem;
          padding: 1.1rem 1.1rem 1.1rem 3.2rem;
          outline: none;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .auth-input:focus {
          border-color: #ff4d00;
          background: #1a1a1a;
          box-shadow: 0 0 20px rgba(255, 77, 0, 0.05);
        }
        .auth-input::placeholder {
          color: rgba(255,255,255,0.15);
        }
      `}</style>
    </div>
  );
};
