import React from 'react';
import { Spin } from 'antd';
import './Loading.scss';

const Loading = ({ fullHeight = false }) => {
  const styles = {
    height: '100vh',
  };
  return (
    <div className="loading-wrapper" style={fullHeight ? styles : {}}>
      <Spin size="large" />
    </div>
  );
};

export default Loading;
