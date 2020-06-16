import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form, Input, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './SignIn.scss';

import firebase from '../../firebase';
import { firebaseAuth } from '../../AuthProvider';

const { Title } = Typography;

const SignIn = () => {
  const { user } = React.useContext(firebaseAuth);
  const [loading, setLoading] = React.useState(false);

  const onFinish = ({ username, password }) => {
    setLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(`${username}@reintegrapp.cl`, password)
      .then(() => {
        setLoading(false);
        message.success('¡Inicio de sesión exitoso!');
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        message.error('Credenciales incorrectas');
      });
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="form-content-center-wrapper">
      <div className="site-layout-content site-layout-content-center-form">
        <Title>Inicio de Sesión</Title>
        <Form name="basic" onFinish={onFinish} className="center-form">
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Por favor ingresa tu nombre de usuario!' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Usuario" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Por favor ingresa tu contraseña!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Iniciar sesión
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;
