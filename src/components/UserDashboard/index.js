import React from 'react';
import { Alert, Tabs } from 'antd';

import ColaboratorsTable from './ColaboratorsTable';
import DailyTable from './DailyTable';
import FormTable from './FormTable';
import Loading from '../Loading';
import OrganizationDataForm from './OrganizationDataForm';

const { TabPane } = Tabs;

const UserDashboard = ({ user }) => {
  const formsDisabled = !user.name;
  const defaultKey = formsDisabled ? '4' : '1';

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="site-layout-content">
      {formsDisabled && (
        <Alert
          type="info"
          message="Debes llenar la información de tu organización para acceder a los cuestionarios."
          banner
        />
      )}

      <Tabs defaultActiveKey={defaultKey}>
        <TabPane tab="Colaboradores" key="1">
          <ColaboratorsTable user={user} />
        </TabPane>
        <TabPane tab="Cuestionario basal" key="2" disabled={formsDisabled}>
          <FormTable user={user} />
        </TabPane>
        <TabPane tab="Cuestionario diario" key="3" disabled={formsDisabled}>
          <DailyTable user={user} />
        </TabPane>
        <TabPane tab="Información de la organización" key="4">
          <OrganizationDataForm user={user} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
