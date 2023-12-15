import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './Firebase';

function AuthDetails() {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return authUser;
}

function userSignout() {
  signOut(auth)
    .then(() => {
      console.log('Signout successful');
    })
    .catch((error) => console.log(error));
}

export { AuthDetails, userSignout };
