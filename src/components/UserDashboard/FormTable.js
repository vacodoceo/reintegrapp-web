import React from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';
import { Button, Dropdown, Menu, message, Table, Tooltip, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';

import firebase from '../../firebase';
import { createColaborator } from '../../services/colaborators';
import AssignColaboratorModal from './AssignColaboratorModal';
import ColTag from './ColTag';
import ResponseDescription from './ResponseDescription';

const { Link, Text } = Typography;

const FormTable = ({ user }) => {
  const [data, setData] = React.useState([]);
  const [snapshot, loading] = useDocument(
    firebase.firestore().doc(`forms/${user.basalFormId}`)
  );
  const [tableLoading, setTableLoading] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [response, setResponse] = React.useState(null);
  const formUrl = `https://docs.google.com/forms/d/${user.basalFormId}`;

  React.useEffect(() => {
    if (snapshot && snapshot.data()) {
      const rawResponses = snapshot.data().responses;
      const arrayData = Object.keys(rawResponses).map((id) => {
        const response = rawResponses[id];
        let name = response.data[0].answer;
        if (name === 'Otro') {
          name = response.data[1].answer;
        }
        return {
          key: id,
          name,
          registered: Object.keys(user.colaborators).includes(name),
          date: response.timestamp,
          verified: response.verified,
          colaborator: response.colaborator,
          data: response.data,
        };
      });

      setData(arrayData);
    }
  }, [snapshot, user.colaborators]);

  const handleColaboratorRegister = (record) => {
    const { name, key } = record;
    const hide = message.loading('Creando colaborador...', 0);
    setTableLoading(true);
    createColaborator({
      userId: user.uid,
      name,
      response: key,
      formId: user.basalFormId,
    })
      .then(() => {
        hide();
        setTableLoading(false);
        message.success('¡Subida exitosa!');
      })
      .catch((e) => {
        setTableLoading(false);
        hide();
        message.error('Ocurrió un error al subir los colaboradores.');
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
        return a.date > b.date;
      },
      width: '20%',
    },
    {
      title: 'Fecha y Hora',
      dataIndex: 'date',
      sorter: (a, b) => {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        return 0;
      },
      render: (text) => {
        const d = new Date(text);
        return moment(d).format('DD[/]MM[/]YY - HH[:]mm');
      },
      width: '15%',
    },
    {
      title: 'Registrado',
      dataIndex: 'registered',
      filters: [
        { text: 'Sí', value: true },
        { text: 'No', value: false },
      ],
      onFilter: (value, record) => record.registered === value,
      render: (text) => <ColTag value={text} />,
      width: '15%',
    },
    {
      title: 'Verified',
      dataIndex: 'verified',
      filters: [
        { text: 'Sí', value: true },
        { text: 'No', value: false },
      ],
      onFilter: (value, record) => record.verified === value,
      render: (text) => <ColTag value={text} />,
      width: '15%',
    },
    {
      title: 'Colaborador asociado',
      dataIndex: 'colaborator',
      sorter: (a, b) => {
        if (!a.colaborator) return 1;
        if (!b.colaborator) return -1;
        if (a.colaborator < b.colaborator) return -1;
        if (a.colaborator > b.colaborator) return 1;
        return a.date > b.date;
      },
      render: (text) => (text ? text : <ColTag value={text} />),
      width: '20%',
    },
    {
      key: 'action',
      render: (record) => {
        const disabled = Object.keys(user.colaborators).includes(record.name);
        const actions = (
          <Menu>
            <Menu.Item
              onClick={() => handleColaboratorRegister(record)}
              disabled={disabled}
            >
              <Tooltip
                title={disabled ? 'Ya existe un colaborador con ese nombre' : null}
              >
                Registrar colaborador
              </Tooltip>
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                setResponse(record.key);
                setModalVisible(true);
              }}
            >
              Asignar colaborador
            </Menu.Item>
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
      <AssignColaboratorModal
        visible={modalVisible}
        setVisible={setModalVisible}
        user={user}
        response={response}
        formId={user.basalFormId}
      />
      <Table
        title={() => (
          <Text>
            {'Formulario: '}
            <Link href={formUrl} target="_blank">
              {formUrl}
            </Link>
          </Text>
        )}
        bordered
        size="middle"
        columns={columns}
        dataSource={data}
        loading={loading || tableLoading}
        expandable={{
          expandedRowRender: (record) => <ResponseDescription response={record} />,
        }}
      />
    </>
  );
};

export default FormTable;
