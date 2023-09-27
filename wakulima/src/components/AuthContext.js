import React, { createContext, useContext, useState, useEffect } from 'react';
import firebase from './firebase'; // Update the path to your Firebase configuration file

// Create the AuthContext
const AuthContext = createContext();

// Create the AuthProvider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Subscribe to Firebase authentication changes
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in
        setUser(authUser);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  // You can add more functions to manage user authentication here, e.g., signIn, signOut, signUp

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
