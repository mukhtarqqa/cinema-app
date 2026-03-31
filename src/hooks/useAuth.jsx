import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, googleProvider } from '../firebase.js';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  sendPasswordResetEmail, 
  sendEmailVerification 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Функция для синхронизации данных пользователя с Firestore
  const syncUserWithDb = async (authUser) => {
    try {
      const userRef = doc(db, 'users', authUser.uid);
      const userSnap = await getDoc(userRef);
      
      let userData;

      if (!userSnap.exists()) {
        // Если пользователя нет в базе — создаем его с ролью 'user'
        userData = {
          uid: authUser.uid,
          email: authUser.email || '',
          displayName: authUser.displayName || 'User',
          photoURL: authUser.photoURL || '',
          role: 'user', // Роль по умолчанию
          createdAt: serverTimestamp(),
        };
        await setDoc(userRef, userData);
      } else {
        // Если есть — забираем данные (включая роль)
        userData = userSnap.data();
      }
      
      // Объединяем: Firestore данные имеют приоритет над Firebase Auth
      setUser({ ...authUser, ...userData, role: userData.role || 'user' });
    } catch (error) {
      console.error("Ошибка при синхронизации профиля:", error);
      setUser(authUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        await syncUserWithDb(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginGoogle = () => signInWithPopup(auth, googleProvider);

  const loginEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const registerEmail = async (email, password, name) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name });
    await sendEmailVerification(res.user);
    // Сразу сохраняем в базу
    await syncUserWithDb(res.user);
    return res;
  };

  const logout = () => signOut(auth);

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);
  
  const verifyEmail = () => {
    if (auth.currentUser) return sendEmailVerification(auth.currentUser);
  };

  const updateUserProfile = async (data) => {
    if (!auth.currentUser) return;
    // Firebase Auth only supports short string fields — never pass base64 to it
    const authSafeData = {};
    if (data.displayName) authSafeData.displayName = data.displayName;
    if (data.photoURL && !data.photoURL.startsWith('data:')) authSafeData.photoURL = data.photoURL;
    if (Object.keys(authSafeData).length > 0) {
      await updateProfile(auth.currentUser, authSafeData);
    }
    // Save everything (including base64 photoURL) to Firestore
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userRef, data, { merge: true });
    // Update local state immediately so UI reflects change without page reload
    setUser(prev => ({ ...prev, ...data }));
  };

  const value = { 
    user, 
    loading, 
    loginGoogle, 
    loginEmail, 
    registerEmail, 
    logout, 
    resetPassword, 
    verifyEmail,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};