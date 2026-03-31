import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, googleProvider } from '../firebase.js';
import { 
  signInWithPopup, signOut, onAuthStateChanged, 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  updateProfile, sendPasswordResetEmail, sendEmailVerification 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

let AuthContext = createContext(undefined);

export let AuthProvider = ({ children }) => {
  let [user, setUser] = useState(null);
  let [loading, setLoading] = useState(true);

  let saveUserToDb = async (u) => {
    try {
      let ref = doc(db, 'users', u.uid);
      let snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          uid: u.uid,
          email: u.email || '',
          displayName: u.displayName || 'User',
          photoURL: u.photoURL || '',
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Firestore error:", error);
    }
  };

  useEffect(() => {
    let unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        saveUserToDb(u); 
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  let loginGoogle = () => signInWithPopup(auth, googleProvider);

  let resetPassword = (email) => sendPasswordResetEmail(auth, email);
  
  let verifyEmail = () => {
    if (auth.currentUser) return sendEmailVerification(auth.currentUser);
  };

  let loginEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);

  let registerEmail = async (email, password, name) => {
    let res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name });
    await sendEmailVerification(res.user);
    saveUserToDb(res.user);
    return res;
  };

  let logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ 
      user, loading, loginGoogle, loginEmail, 
      registerEmail, logout, resetPassword, verifyEmail 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export let useAuth = () => {
  let ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
