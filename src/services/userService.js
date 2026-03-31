import { db, doc, getDoc, setDoc, serverTimestamp } from '../firebase';

let getUserWithRole = async (user) => {
  let userRef = doc(db, 'users', user.uid);
  let userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return { ...user, role: userSnap.data().role };
  }

  let newUser = {
    email: user.email,
    role: 'user',
    createdAt: serverTimestamp()
  };

  await setDoc(userRef, newUser);
  return { ...user, ...newUser };
};

export { getUserWithRole };