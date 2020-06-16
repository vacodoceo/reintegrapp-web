import React from 'react';
import { Button, Dropdown, message, Menu, Modal, Table } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import { deleteColaborator, updateColaborator } from '../../services/colaborators';
import AddColaboratorsModal from './AddColaboratorsModal';
import ColTag from './ColTag';
import ResponseDescription from './ResponseDescription';

const { SubMenu } = Menu;
const { confirm } = Modal;

const menuUpdates = [
  {
    role: 1,
    key: 'productivity',
    display: 'Definir productividad',
    values: [
      { value: 'high', display: 'Alta' },
      { value: 'medium', display: 'Mediana' },
      { value: 'low', display: 'Baja' },
    ],
  },
  {
    role: 1,
    key: 'interest',
    display: 'Definir interés presencial',
    values: [
      { value: 'high', display: 'Alto' },
      { value: 'medium', display: 'Mediano' },
      { value: 'low', display: 'Bajo' },
    ],
  },
  {
    role: 2,
    key: 'light',
    display: 'Definir luz',
    values: [
      { value: 'green', display: 'Verde' },
      { value: 'yellow', display: 'Amarilla' },
      { value: 'red', display: 'Roja' },
    ],
  },
];

const ColaboratorsTable = ({ user }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    const rawColaborators = user.colaborators;
    const arrayData = Object.keys(rawColaborators).map((name) => {
      const {
        productivity,
        interest,
        light,
        state,
        response,
        area,
      } = rawColaborators[name];
      return {
        key: name,
        response: response,
        answered: !!response,
        name,
        area,
        productivity,
        interest,
        light,
        state,
      };
    });

    setData(arrayData);
  }, [user]);

  const handleDelete = (record) => {
    confirm({
      title: '¿Estás seguro de querer eliminar este colaborador?',
      okText: 'Sí',
      cancelText: 'No',
      onOk() {
        const hide = message.loading('Eliminando usuario...', 0);
        setLoading(true);
        deleteColaborator({ userId: user.uid, name: record.name })
          .then(() => {
            hide();
            setLoading(false);
            message.success('Colaborador eliminado exitosamente!');
          })
          .catch((e) => {
            console.log(e);
            hide();
            setLoading(false);
            message.error('Hubo un problema al eliminar al colaborador.');
          });
      },
    });
  };

  const handleUpdate = (record, key, value) => {
    const hide = message.loading('Actualizando usuario...', 0);
    setLoading(true);
    updateColaborator({ userId: user.uid, name: record.name, key, value })
      .then(() => {
        hide();
        setLoading(false);
        message.success('Colaborador actualizado exitosamente!');
      })
      .catch(() => {
        hide();
        setLoading(false);
        message.error('Hubo un problema al actualizar al colaborador.');
      });
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      },
      width: '20%',
    },
    {
      title: 'Área',
      dataIndex: 'area',

      render: (text) => <ColTag value={text} />,
      width: '10%',
    },
    {
      title: 'Cuestionario basal respondido',
      dataIndex: 'answered',
      filters: [
        { text: 'Sí', value: true },
        { text: 'No', value: false },
      ],
      onFilter: (value, record) => !!record.answered === value,
      render: (text) => <ColTag value={text} />,
      width: '10%',
    },
    {
      title: 'Productividad remota',
      dataIndex: 'productivity',
      render: (text) => <ColTag value={text} />,
      width: '10%',
    },
    {
      title: 'Interés presencial',
      dataIndex: 'interest',
      render: (text) => <ColTag value={text} />,
      width: '10%',
    },
    {
      title: 'Luz',
      dataIndex: 'light',
      render: (text) => <ColTag value={text} />,
      width: '10%',
    },
    {
      title: 'Estado',
      dataIndex: 'state',
      render: (text) => <ColTag value={text} />,
      width: '10%',
    },
    {
      key: 'action',
      render: (record) => {
        const actions = (
          <Menu>
            <Menu.Item key="delete" onClick={() => handleDelete(record)}>
              Eliminar colaborador
            </Menu.Item>
            {menuUpdates.map(
              (m) =>
                user.role >= m.role && (
                  <SubMenu title={m.display} key={m.key}>
                    {m.values.map((p) => (
                      <Menu.Item
                        key={p.value}
                        onClick={() => handleUpdate(record, m.key, p.value)}
                      >
                        {p.display}
                      </Menu.Item>
                    ))}
                  </SubMenu>
                )
            )}
          </Menu>
        );

        return (
          <Dropdown overlay={actions}>
            <Button>
              Acciones <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        Añadir colaboradores
      </Button>
      <AddColaboratorsModal
        visible={modalVisible}
        setVisible={setModalVisible}
        user={user}
      />
      <Table
        bordered
        size="middle"
        columns={columns}
        dataSource={data}
        loading={loading}
        className="colaborators-table"
        expandable={{
          expandedRowRender: (record) => (
            <ResponseDescription
              responseId={record.response}
              formId={user.basalFormId}
            />
          ),
          rowExpandable: (record) => record.response,
        }}
      />
    </>
  );
};

export default ColaboratorsTable;
