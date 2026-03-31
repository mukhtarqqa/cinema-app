import { db, auth } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  orderBy,
  limit,
  updateDoc,
  setDoc
} from 'firebase/firestore';

// Добавление в историю просмотров
export const addToHistory = async (item, type) => {
  if (!auth.currentUser) return;
  const uid = auth.currentUser.uid;
  const itemId = String(item.id);
  
  try {
    // Используем уникальный ID (UID_ItemID), чтобы избежать дублей на уровне БД
    const docRef = doc(db, 'history', `${uid}_${itemId}`);
    await setDoc(docRef, {
      uid: uid,
      itemId: itemId,
      title: type === 'movie' ? (item.title || '') : (item.name?.main || item.name || ''),
      poster: type === 'movie' ? (item.poster_path || '') : (item.poster?.src || ''),
      contentType: type,
      watchedAt: serverTimestamp()
    });
  } catch (error) {
    // Silent fail
  }
};

// Добавление в "Посмотреть позже"
export const addToWatchLater = async (item, type) => {
  if (!auth.currentUser) return;
  const uid = auth.currentUser.uid;
  const itemId = String(item.id);

  try {
    const docRef = doc(db, 'watchLater', `${uid}_${itemId}`);
    await setDoc(docRef, {
      uid: uid,
      itemId: itemId,
      title: type === 'movie' ? (item.title || '') : (item.name?.main || item.name || ''),
      poster: type === 'movie' ? (item.poster_path || '') : (item.poster?.src || ''),
      contentType: type,
      addedAt: serverTimestamp()
    });
  } catch (error) {
    // Silent fail
  }
};

// Получение истории пользователя
export const getUserHistory = async () => {
  if (!auth.currentUser) return [];
  try {
    const q = query(
      collection(db, 'history'),
      where('uid', '==', auth.currentUser.uid),
      orderBy('watchedAt', 'desc'),
      limit(20)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Get History Error:", error);
    return [];
  }
};