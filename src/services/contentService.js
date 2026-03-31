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
export const addToHistory = async (item, type, lastEpisode = null) => {
  if (!auth.currentUser) return;
  const uid = auth.currentUser.uid;
  const itemId = String(item.id);
  
  try {
    const docRef = doc(db, 'history', `${uid}_${itemId}`);
    const saveData = {
      uid: uid,
      itemId: itemId,
      title: type === 'movie' ? (item.title || '') : (item.name?.main || item.name || ''),
      poster: type === 'movie' ? (item.poster_path || '') : (item.poster?.src || ''),
      contentType: type,
      watchedAt: serverTimestamp()
    };
    if (lastEpisode !== null) saveData.lastEpisode = lastEpisode;
    await setDoc(docRef, saveData, { merge: true });
  } catch (error) {
    // Silent fail
  }
};

// Получить запись истории для конкретного элемента (для восстановления прогресса)
export const getHistoryItem = async (itemId) => {
  if (!auth.currentUser) return null;
  try {
    const { getDoc } = await import('firebase/firestore');
    const docRef = doc(db, 'history', `${auth.currentUser.uid}_${String(itemId)}`);
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : null;
  } catch {
    return null;
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