import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import Loading from '../Loading';
import { firebaseAuth } from '../../AuthProvider';

const PrivateRoute = ({ component: Component, role = 0, ...rest }) => {
  const { user } = React.useContext(firebaseAuth);

  if (!user) return <Redirect to="/sign-in" />;
  if (!user.role) return <Loading />;

  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route
      {...rest}
      render={(props) =>
        user.role >= role ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default PrivateRoute;
