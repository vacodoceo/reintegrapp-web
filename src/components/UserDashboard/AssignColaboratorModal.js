import React from 'react';
import { Button, Form, message, Modal, Select } from 'antd';

import { updateColaborator } from '../../services/colaborators';
import { updateResponse } from '../../services/responses';

const AddColaboratorsModal = ({ visible, setVisible, user, response, formId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleAssignColaborator = async ({ colaborator }) => {
    const hide = message.loading('Asignando colaborador...', 0);

    await updateResponse({
      formId,
      responseId: response,
      key: 'colaborator',
      value: colaborator,
      userId: user.uid,
    });

    updateColaborator({
      userId: user.uid,
      name: colaborator,
      key: 'response',
      value: response,
      formId,
    })
      .then(() => {
        hide();
        setLoading(false);
        message.success('¡Asignación exitosa!');
        form.resetFields();
        setVisible(false);
      })
      .catch(() => {
        setLoading(false);
        hide();
        message.error('Ocurrió un error al asignar el colaborador.');
      });
  };

  const onAssignClick = (e) => {
    form.submit();
  };

  return (
    <Modal
      title="Asignar colaborador"
      visible={visible}
      onCancel={() => setVisible(false)}
      width={350}
      footer={
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={onAssignClick}
        >
          Asignar
        </Button>
      }
    >
      <Form name="basic" onFinish={handleAssignColaborator} form={form}>
        <Form.Item
          name="colaborator"
          rules={[{ required: true, message: 'Debes seleccionar a un colaborador' }]}
        >
          <Select className="select-assign-colaborator">
            {Object.keys(user.colaborators)
              .sort()
              .map((c) => (
                <Select.Option key={c} value={c}>
                  {c}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddColaboratorsModal;
