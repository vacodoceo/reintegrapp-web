import React from 'react';
import { Button, Form, Input, message, Modal, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { createColaborators } from '../../services/colaborators';

const AddColaboratorsModal = ({ visible, setVisible, user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleAddColaborators = ({ colaborators }) => {
    const namesArray = colaborators.map((c) => c.name);
    const hide = message.loading('Subiendo colaboradores...', 0);
    setLoading(true);

    createColaborators({ userId: user.uid, namesArray })
      .then(() => {
        hide();
        setLoading(false);
        message.success('¡Subida exitosa!');
        form.resetFields();
        setVisible(false);
      })
      .catch((e) => {
        setLoading(false);
        hide();
        message.error('Ocurrió un error al subir los colaboradores.');
      });
  };

  const onAddClick = (e) => {
    form.submit();
  };

  return (
    <Modal
      title="Añadir colaboradores"
      visible={visible}
      okText="Añadir"
      onCancel={() => setVisible(false)}
      footer={
        <Button key="submit" type="primary" loading={loading} onClick={onAddClick}>
          Añadir
        </Button>
      }
    >
      <Form
        name="basic"
        onFinish={handleAddColaborators}
        initialValues={{ colaborators: [{ name: '' }] }}
        form={form}
      >
        <Form.List name="colaborators">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field) => {
                  return (
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
                          {
                            required: true,
                            message: 'Ingresa el nombre del colaborador',
                          },
                          {
                            validator: (rule, value) => {
                              if (Object.keys(user.colaborators).includes(value)) {
                                return Promise.reject('Ese colaborador ya existe!');
                              } else {
                                return Promise.resolve();
                              }
                            },
                          },
                        ]}
                      >
                        <Input placeholder="Nombre del colaborador" />
                      </Form.Item>

                      <MinusCircleOutlined
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    </Space>
                  );
                })}

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    block
                  >
                    <PlusOutlined /> Add field
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default AddColaboratorsModal;
