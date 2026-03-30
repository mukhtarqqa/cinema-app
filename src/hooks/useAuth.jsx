import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, googleProvider } from '../firebase.js';
import { 
  signInWithPopup, signOut, onAuthStateChanged, 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  updateProfile, RecaptchaVerifier, signInWithPhoneNumber,
  sendPasswordResetEmail, sendEmailVerification 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveUserToDb = async (u) => {
    const ref = doc(db, 'users', u.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: u.uid,
        email: u.email || '',
        displayName: u.displayName || 'User',
        photoURL: u.photoURL || '',
        createdAt: serverTimestamp(),
      });
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        await saveUserToDb(u);
        setUser(u);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = () => signInWithPopup(auth, googleProvider);

  const setupRecaptcha = (containerId) => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      'size': 'normal', // 'invisible' орнына 'normal' қойдық, сонда капча анық көрінеді және қате аз болады
      'callback': () => {}
    });
    return window.recaptchaVerifier;
  };

  const loginPhone = (phoneNumber, containerId) => {
    const verifier = setupRecaptcha(containerId);
    return signInWithPhoneNumber(auth, phoneNumber, verifier);
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);
  
  const verifyEmail = () => {
    if (auth.currentUser) return sendEmailVerification(auth.currentUser);
  };

  const loginEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const registerEmail = async (email, password, name) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name });
    await sendEmailVerification(res.user);
    await saveUserToDb(res.user);
    return res;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ 
      user, loading, login, loginPhone, loginEmail, 
      registerEmail, logout, resetPassword, verifyEmail 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
