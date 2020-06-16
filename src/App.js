import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import './App.css';

import PrivateRoute from './components/PrivateRoute';
import MyHeader from './components/Header';
import MyFooter from './components/Footer';
import Home from './components/Home';
import SignIn from './components/SignIn';
import CreateUser from './components/CreateUser';

const { Content } = Layout;

const App = () => {
  return (
    <BrowserRouter>
      <Layout className="layout">
        <MyHeader />
        <Content style={{ padding: '0 50px' }}>
          <Switch>
            <PrivateRoute component={Home} path="/" exact />
            <PrivateRoute
              component={CreateUser}
              role={2}
              path="/create-user"
              exact
            />
            <Route component={SignIn} path="/sign-in" exact />
          </Switch>
        </Content>
        <MyFooter />
      </Layout>
    </BrowserRouter>
  );
};

export default App;
