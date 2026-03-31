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
  limit 
} from 'firebase/firestore';

// Добавление в историю просмотров
export const addToHistory = async (item, type) => {
  if (!auth.currentUser) return;
  try {
    await addDoc(collection(db, 'history'), {
      uid: auth.currentUser.uid,
      itemId: String(item.id),
      title: item.title || item.name,
      poster: item.poster_path || '',
      contentType: type,
      watchedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("History Error:", error);
  }
};

// Добавление в "Посмотреть позже"
export const addToWatchLater = async (item, type) => {
  if (!auth.currentUser) return;
  try {
    // Проверяем, нет ли уже такого фильма в списке
    const q = query(
      collection(db, 'watchLater'),
      where('uid', '==', auth.currentUser.uid),
      where('itemId', '==', String(item.id))
    );
    const existing = await getDocs(q);
    if (!existing.empty) {
      alert("Уже есть в списке!");
      return;
    }

    await addDoc(collection(db, 'watchLater'), {
      uid: auth.currentUser.uid,
      itemId: String(item.id),
      title: item.title || item.name,
      poster: item.poster_path || '',
      contentType: type,
      addedAt: serverTimestamp()
    });
    alert("Добавлено в список ожидания!");
  } catch (error) {
    console.error("WatchLater Error:", error);
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