import React from 'react';

import AdminDashboard from '../AdminDashboard';
import UserDashboard from '../UserDashboard';
import { firebaseAuth } from '../../AuthProvider';

const Home = () => {
  const { user } = React.useContext(firebaseAuth);

  if (user.role === 1) return <UserDashboard user={user} />;
  else {
    return <AdminDashboard />;
  }
};

export default Home;
