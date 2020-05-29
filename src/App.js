import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from './firebase';

const App = () => {
  const [user, loading, error] = useAuthState(firebase.auth());

  console.log(user, loading, error);

  return (
    <div className="App">
      <header className="App-header">
        <p>Test</p>
      </header>
    </div>
  );
};

export default App;
