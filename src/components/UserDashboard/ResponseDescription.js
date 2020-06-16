import React from 'react';
import { Descriptions } from 'antd';

import firebase from '../../firebase';
import Loading from '../Loading';

const ResponseDescription = ({ response, formId, responseId }) => {
  const [res, setRes] = React.useState(response);

  if (!res) {
    console.log(formId);
    console.log(responseId);

    firebase
      .firestore()
      .doc(`forms/${formId}`)
      .get()
      .then((formDoc) => {
        setRes(formDoc.data().responses[responseId]);
      });

    return <Loading />;
  }

  return (
    <Descriptions size="small" bordered>
      {res.data.map((r, i) => (
        <Descriptions.Item label={r.question} key={i} span={3}>
          {r.answer}
        </Descriptions.Item>
      ))}
    </Descriptions>
  );
};

export default ResponseDescription;
