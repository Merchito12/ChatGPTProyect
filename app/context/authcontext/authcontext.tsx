// context/authcontext/authcontext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../utils/FirebaseConfig';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  User
} from 'firebase/auth';

interface AuthContextProps {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }
  
  async function signup(email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    await signOut(auth);
  }

  const value: AuthContextProps = {
    currentUser,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
