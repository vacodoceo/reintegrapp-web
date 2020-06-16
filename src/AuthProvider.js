import React, { useState } from 'react';

import Loading from './components/Loading';
import firebase from './firebase';

export const firebaseAuth = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showChild, setShowChild] = useState(false);

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        await firebase
          .firestore()
          .doc(`users/${user.uid}`)
          .onSnapshot((documentSnapshot) => {
            const userData = { ...user, ...documentSnapshot.data() };
            setUser(userData);
          });
      }

      setShowChild(true);
    });
  }, []);

  if (!showChild) {
    return <Loading />;
  } else {
    return (
      <firebaseAuth.Provider
        value={{
          user,
          setUser,
        }}
      >
        {children}
      </firebaseAuth.Provider>
    );
  }
};

export default AuthProvider;
