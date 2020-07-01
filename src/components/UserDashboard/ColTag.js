import React from 'react';
import { Tag, Typography } from 'antd';

const colors = {
  false: 'red',
  true: 'green',
  null: 'lightgray',
  remote: 'purple',
  office: 'blue',
  high: 'green',
  medium: 'yellow',
  low: 'red',
  green: 'green',
  yellow: 'yellow',
  red: 'red',
  enabled: 'green',
  disabled: 'red',
};
const texts = {
  false: 'NO',
  true: 'SÍ',
  null: 'INDEFINIDO',
  remote: 'REMOTO',
  office: 'OFICINA',
  high: 'ALTA',
  medium: 'MEDIA',
  low: 'BAJA',
  green: 'VERDE',
  yellow: 'AMARILLA',
  red: 'ROJA',
  enabled: 'HABILITADO',
  disabled: 'INHABILITADO',
};

const ColTag = (text) => {
  const [value, setValue] = React.useState(null);

  React.useEffect(() => {
    setValue(text.value);
  }, [text]);

  return <Tag color={colors[value]}>{texts[value]}</Tag>;
};

export default ColTag;
