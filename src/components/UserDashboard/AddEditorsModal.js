import React from 'react';
import { Button, Form, Input, message, Modal, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { addEditors } from '../../services/editors';

const AddEditorsModal = ({ visible, setVisible, form, formId }) => {
  const [modalForm] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const initialEditors = form.editors.map((e) => ({ email: e }));

  const handleAddEditors = ({ editors }) => {
    const editorsArray = editors.map((e) => e.email);
    const hide = message.loading('Subiendo editores...', 0);
    setLoading(true);

    addEditors({ formId, editors: editorsArray })
      .then(() => {
        hide();
        setLoading(false);
        message.success('¡Subida exitosa!');
        modalForm.resetFields();
        setVisible(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        hide();
        message.error('Ocurrió un error al subir los colaboradores.');
      });
  };

  const onAddClick = (e) => {
    modalForm.submit();
  };

  return (
    <Modal
      title="Administrar editores"
      visible={visible}
      okText="Añadir"
      onCancel={() => setVisible(false)}
      footer={
        <Button key="submit" type="primary" loading={loading} onClick={onAddClick}>
          Aceptar
        </Button>
      }
    >
      <Form
        name="basic"
        onFinish={handleAddEditors}
        initialValues={{ editors: initialEditors }}
        form={modalForm}
      >
        <Form.List name="editors">
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
                        name={[field.name, 'email']}
                        fieldKey={[field.fieldKey, 'email']}
                        rules={[
                          {
                            required: true,
                            message: 'Ingresa el correo del editor',
                          },
                        ]}
                      >
                        <Input placeholder="Correo del editor" />
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

export default AddEditorsModal;
