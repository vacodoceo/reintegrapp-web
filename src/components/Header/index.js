import React from 'react';
import { NavLink } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import './Header.scss';

import { firebaseAuth } from '../../AuthProvider';
import firebase from '../../firebase';

const { Header } = Layout;
const { SubMenu } = Menu;

const MyHeader = () => {
  const { user } = React.useContext(firebaseAuth);

  const handleLogOut = () => {
    firebase.auth().signOut();
  };

  return (
    <Header>
      <div className="logo" />
      {user && (
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['home']}
          className="header-menu"
        >
          <Menu.Item key="home">
            <NavLink to="/">Inicio</NavLink>
          </Menu.Item>

          <SubMenu
            title={`Hola, ${user.email.replace('@reintegrapp.cl', '')}`}
            id="header-auth-sub-menu"
          >
            {user.role > 0 && (
              <Menu.Item key="create-user">
                <NavLink to="create-user">Crear usuario</NavLink>
              </Menu.Item>
            )}
            <Menu.Item key="logout" onClick={handleLogOut}>
              Cerrar sesión
            </Menu.Item>
          </SubMenu>
        </Menu>
      )}
    </Header>
  );
};

export default MyHeader;
