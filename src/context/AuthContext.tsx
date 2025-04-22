// src/context/AuthContext.tsx

import React, { createContext, ReactNode, useState, useEffect, useContext } from 'react';
import { auth, firestore } from '../config/firebase';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Types for our user and context
interface UserProfile {
  id: string;
  email: string;
  onboarded: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser: FirebaseAuthTypes.User | null) => {
      if (firebaseUser) {
        const doc = await firestore().collection('users').doc(firebaseUser.uid).get();
        if (doc.exists) {
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            onboarded: doc.data()?.onboarded || false,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string) => {
    const credential = await auth().createUserWithEmailAndPassword(email, password);
    // Create user document
    await firestore().collection('users').doc(credential.user.uid).set({
      email,
      createdAt: firestore.FieldValue.serverTimestamp(),
      onboarded: false,
    });
  };

  const signIn = async (email: string, password: string) => {
    await auth().signInWithEmailAndPassword(email, password);
  };

  const signOut = async () => {
    await auth().signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
