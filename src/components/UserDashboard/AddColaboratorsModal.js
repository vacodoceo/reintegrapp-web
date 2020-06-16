import React from 'react';
import { Button, Form, Input, message, Modal, Select, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { createColaborators } from '../../services/colaborators';

const { Option } = Select;

const AddColaboratorsModal = ({ visible, setVisible, user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const areas = Object.keys(user.areas).sort();

  const handleAddColaborators = ({ colaborators }) => {
    const colaboratorsObject = {};
    colaborators.forEach((c) => {
      colaboratorsObject[c.name] = {
        area: c.area,
        phone: c.phone,
      };
    });
    const hide = message.loading('Subiendo colaboradores...', 0);
    setLoading(true);

    createColaborators({ userId: user.uid, colaboratorsObject })
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
                      className="colaborators-form-space"
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
                        <Input placeholder="Nombre" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'phone']}
                        fieldKey={[field.fieldKey, 'phone']}
                        rules={[
                          {
                            required: true,
                            message: 'Ingresa el teléfono del colaborador',
                          },
                        ]}
                      >
                        <Input placeholder="Teléfono" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'area']}
                        fieldKey={[field.fieldKey, 'area']}
                        rules={[
                          {
                            required: true,
                            message: 'Ingresa el área del colaborador',
                          },
                        ]}
                      >
                        <Select placeholder="Área" allowClear>
                          {areas.map((a) => (
                            <Option key={a} value={a}>
                              {a}
                            </Option>
                          ))}
                        </Select>
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
                    <PlusOutlined /> Agregar campo
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
