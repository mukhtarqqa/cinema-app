import { db } from '../firebase.js';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';

export async function addReview(itemId, userId, text, rating) {
  let reviewsRef = collection(db, 'reviews');
  return addDoc(reviewsRef, {
    itemId,
    userId,
    text,
    rating,
    createdAt: serverTimestamp()
  });
}

export async function getReviews(itemId) {
  let reviewsRef = collection(db, 'reviews');
  let q = query(reviewsRef, where('itemId', '==', itemId), orderBy('createdAt', 'desc'));
  let snapshot = await getDocs(q);
  return snapshot.docs.map(docSnapshot => ({ id: docSnapshot.id, ...docSnapshot.data() }));
}

export async function deleteReview(reviewId) {
  let reviewRef = doc(db, 'reviews', reviewId);
  return deleteDoc(reviewRef);
}
