import React from 'react';
import { Button, Form, Input, message, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import firebase from '../../firebase';
import './UserDashboard.scss';

const OrganizationDataForm = ({ user }) => {
  const [loading, setLoading] = React.useState(false);

  const { name, areas } = user;

  const onFinish = (e) => {
    const newAreas = {};
    e.areas.forEach(
      (a) =>
        (newAreas[a.name] = {
          quantity: a.quantity,
        })
    );

    setLoading(true);
    firebase
      .firestore()
      .doc(`users/${user.uid}`)
      .update({
        name: e.name,
        areas: newAreas,
      })
      .then(() => {
        setLoading(false);
        message.success('¡Información actualizada exitósamente!');
      })
      .catch(() => {
        setLoading(false);
        message.error('Ocurrió un error al actualizar tu información');
      });
  };

  return (
    <div className="tab-content-wrapper">
      <Form
        name="basic"
        onFinish={onFinish}
        className="organization-data-form"
        initialValues={{
          name,
          areas: Object.keys(areas).map((a) => ({
            name: a,
            quantity: areas[a].quantity,
          })),
        }}
      >
        <Form.Item
          name="name"
          label="Nombre de la organización"
          rules={[
            {
              required: true,
              message: 'Por favor ingresa el nombre de tu organización!',
            },
          ]}
        >
          <Input placeholder="Nombre" />
        </Form.Item>

        <Form.List name="areas">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="start"
                    className="form-dynamic-nest-space"
                  >
                    <Form.Item
                      name={[field.name, 'name']}
                      fieldKey={[field.fieldKey, 'name']}
                      rules={[
                        { required: true, message: 'Ingresa el nombre del área' },
                      ]}
                    >
                      <Input placeholder="Nombre del área" />
                    </Form.Item>
                    <Form.Item
                      name={[field.name, 'quantity']}
                      fieldKey={[field.fieldKey, 'quantity']}
                      rules={[
                        {
                          required: true,
                          message: 'Ingresa la máxima cantidad de personas',
                        },
                      ]}
                    >
                      <Input placeholder="Máxima cantidad de personas" />
                    </Form.Item>

                    <MinusCircleOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    block
                  >
                    <PlusOutlined /> Agregar campo
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Guardar información
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default OrganizationDataForm;
