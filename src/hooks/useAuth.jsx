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

  const syncUserWithDb = async (authUser) => {
    try {
      const userRef = doc(db, 'users', authUser.uid);
      const userSnap = await getDoc(userRef);
      
      let userData;

      if (!userSnap.exists()) {
        userData = {
          uid: authUser.uid,
          email: authUser.email || '',
          displayName: authUser.displayName || 'User',
          photoURL: authUser.photoURL || '',
          role: 'user',
          createdAt: serverTimestamp(),
        };
        await setDoc(userRef, userData);
      } else {
        userData = userSnap.data();
      }
      
      setUser({ ...authUser, ...userData, role: userData.role || 'user' });
    } catch (error) {
      console.error("error syncing profile:", error);
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
    const authSafeData = {};
    if (data.displayName) authSafeData.displayName = data.displayName;
    if (data.photoURL && !data.photoURL.startsWith('data:')) authSafeData.photoURL = data.photoURL;
    if (Object.keys(authSafeData).length > 0) {
      await updateProfile(auth.currentUser, authSafeData);
    }
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userRef, data, { merge: true });
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};