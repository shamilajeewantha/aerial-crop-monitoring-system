import React, { useEffect, useState } from 'react';
import { db } from './Firebase';
import { collection, getDocs } from 'firebase/firestore';
import { AuthDetails } from './AuthDetails';

function FirebaseQuery() {
  const authUser = AuthDetails();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authUser || !authUser.uid) {
      return; // Return early if authUser or uid is not available
    }

    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, authUser.uid));
        const newData = {};

        querySnapshot.forEach((doc) => {
          newData[doc.id] = doc.data();
        });
        

        setData(newData);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, [authUser]);


  return {data, error};
}

export { FirebaseQuery };
