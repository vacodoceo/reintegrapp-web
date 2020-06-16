import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';

import Loading from '../Loading';
import firebase from '../../firebase';

const AdminDashboard = () => {
  const [user] = useAuthState(firebase.auth());
  const [value, loading, error] = useDocument(
    firebase.firestore().doc(`users/${user.uid}`)
  );

  if (loading) {
    return <Loading />;
  }

  return <div className="site-layout-content">DASHBOARD</div>;
};

export default AdminDashboard;
