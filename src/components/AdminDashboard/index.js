import React from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Button, PageHeader, Table, Typography } from 'antd';

import Loading from '../Loading';
import firebase from '../../firebase';
import UserDashboard from '../UserDashboard';
import './AdminDashboard.scss';

const { Text, Title } = Typography;

const AdminDashboard = () => {
  const [data, setData] = React.useState([]);
  const [value, loading] = useCollection(firebase.firestore().collection('users'));
  const [selectedUser, setSelectedUser] = React.useState();

  React.useEffect(() => {
    if (value) {
      const organizationUsers = value.docs.filter((doc) => doc.data().role === 1);
      setData(organizationUsers.map((doc) => ({ ...doc.data(), uid: doc.id })));

      if (selectedUser) {
        const userDoc = organizationUsers.filter(
          (doc) => doc.id === selectedUser.uid
        )[0];
        setSelectedUser({ ...userDoc.data(), uid: userDoc.id });
      }
    }
  }, [value]);

  const renderName = (text) => {
    if (!text) {
      return <Text disabled>Sin nombre</Text>;
    }
    return <Text>{text}</Text>;
  };

  const renderVerificatedColaborators = (record) => {
    const colaboratorsData = Object.values(record.colaborators);
    const verificated = colaboratorsData.filter((c) => c.light).length;
    return verificated;
  };

  const renderTotalColaborators = (record) => {
    return Object.keys(record.colaborators).length;
  };

  const renderButtons = (user) => (
    <Button onClick={() => setSelectedUser(user)}>Ver organización</Button>
  );

  const columns = [
    {
      title: 'Organización',
      dataIndex: 'name',
      key: 'name',
      render: renderName,
    },
    {
      title: 'Usuario',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Colaboradores verificados',
      key: 'verificatedColaborators',
      render: renderVerificatedColaborators,
    },
    {
      title: 'Colaboradores totales',
      key: 'totalColaborators',
      render: renderTotalColaborators,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: renderButtons,
    },
  ];

  if (loading) {
    return <Loading />;
  }

  if (selectedUser) {
    return (
      <div className="site-layout-wrapper">
        <div className="site-layout-breadcrumb">
          <PageHeader
            className="site-page-header"
            onBack={() => setSelectedUser()}
            title={selectedUser.name}
            subTitle={selectedUser.username}
          />
        </div>

        <UserDashboard user={selectedUser} />
      </div>
    );
  }

  return (
    <div className="site-layout-content">
      <Title style={{ marginTop: '8px' }}>Dashboard</Title>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="uid"
        bordered
        loading={loading}
      />
    </div>
  );
};

export default AdminDashboard;
