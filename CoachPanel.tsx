import { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { doc, getDoc, setDoc, updateDoc, collection, onSnapshot, query, addDoc, serverTimestamp, orderBy, deleteDoc } from 'firebase/firestore';
import { UserProfile, MealAnalysis } from './types';
import { useAuth } from './contexts/AuthContext';

export function useAppStore() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<MealAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Profile Snapshot
    const profileRef = doc(db, 'users', user.uid);
    const unsubProfile = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    });

    // History Snapshot
    const mealsRef = collection(db, 'users', user.uid, 'meals');
    const q = query(mealsRef, orderBy('createdAt', 'desc'));
    const unsubHistory = onSnapshot(q, (snapshot) => {
      const meals = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as MealAnalysis));
      setHistory(meals);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/meals`);
    });

    return () => {
      unsubProfile();
      unsubHistory();
    };
  }, [user]);

  const updateProfile = async (newProfile: UserProfile) => {
    if (!user) return;
    try {
      const profileRef = doc(db, 'users', user.uid);
      const snap = await getDoc(profileRef);
      if (snap.exists()) {
        await updateDoc(profileRef, {
          ...newProfile,
          updatedAt: serverTimestamp()
        });
      } else {
        await setDoc(profileRef, {
          ...newProfile,
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const addMeal = async (meal: MealAnalysis) => {
    if (!user) return;
    try {
      const mealsRef = collection(db, 'users', user.uid, 'meals');
      await addDoc(mealsRef, {
        ...meal,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/meals`);
    }
  };

  const deleteMeal = async (mealId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'meals', mealId));
    } catch(err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/meals/${mealId}`);
    }
  }

  return { profile, updateProfile, history, addMeal, deleteMeal, loading };
}
