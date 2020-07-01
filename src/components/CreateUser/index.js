import React from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form, Input, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import firebase from '../../firebase';

const { Title } = Typography;

const CreateUser = () => {
  const [loading, setLoading] = React.useState(false);
  const [created, setCreated] = React.useState(false);
  const createUser = firebase.functions().httpsCallable('createUser');
  const [form] = Form.useForm();

  const onFinish = ({ username, password }) => {
    setLoading(true);
    const hide = message.loading(
      'Creando usuario, esto podría tomar unos segundos...',
      0
    );
    createUser({ username, password, role: 1 })
      .then(() => {
        hide();
        message.success('¡Se creó el usuario exitosamente!');
        form.resetFields();
        setLoading(false);
        setCreated(true);
      })
      .catch((err) => {
        hide();
        console.log(err.code);
        if (err.code === 'already-exists') {
          message.error('Nombre de usuario ya existente');
        } else {
          message.error('Ocurrió un error al crear el usuario');
        }
        setLoading(false);
      });
  };

  if (created) {
    return <Redirect to="/" />;
  }

  return (
    <div className="form-content-center-wrapper">
      <div className="site-layout-content site-layout-content-center-form">
        <Title>Crear usuario</Title>
        <Form onFinish={onFinish} className="center-form" form={form}>
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
              Crear usuario
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreateUser;
