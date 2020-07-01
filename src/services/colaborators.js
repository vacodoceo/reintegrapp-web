import firebase from '../firebase';

export const createColaborator = async ({ userId, name, response, formId }) => {
  await firebase
    .firestore()
    .doc(`forms/${formId}`)
    .update({
      [`responses.${response}.colaborator`]: name,
    });

  return firebase
    .firestore()
    .doc(`users/${userId}`)
    .update({
      [`colaborators.${name}`]: {
        response,
        light: null,
        state: 'remote',
        productivity: null,
        interest: null,
        area: null,
      },
    });
};

export const createColaborators = ({ userId, colaboratorsObject }) => {
  const colaborators = {};
  Object.keys(colaboratorsObject).forEach((name) => {
    colaborators[`colaborators.${name}`] = {
      response: null,
      light: null,
      state: 'remote',
      productivity: null,
      interest: null,
      area: null,
      ...colaboratorsObject[name],
    };
  });

  return firebase.firestore().doc(`users/${userId}`).update(colaborators);
};

export const updateColaborator = async ({
  userId,
  name,
  key,
  value,
  formId = null,
}) => {
  if (key === 'response') {
    const userDoc = await firebase.firestore().doc(`users/${userId}`).get();
    const response = userDoc.data().colaborators[name].response;
    if (response) {
      await firebase
        .firestore()
        .doc(`forms/${formId}`)
        .update({ [`responses.${response}.colaborator`]: null });
    }
  }
  const colaboratorData = {
    [`colaborators.${name}.${key}`]: value,
  };

  return firebase.firestore().doc(`users/${userId}`).update(colaboratorData);
};

export const deleteColaborator = async ({ userId, name }) => {
  const userDoc = await firebase.firestore().doc(`users/${userId}`).get();
  const { basalFormId, dailyFormId } = userDoc.data();
  [basalFormId, dailyFormId].forEach(async (formId) => {
    const formDoc = await firebase.firestore().doc(`forms/${formId}`).get();
    const { responses } = formDoc.data();
    Object.entries(responses).forEach(([key, value]) => {
      if (value.colaborator === name) {
        responses[key].colaborator = null;
      }
    });
    await firebase.firestore().doc(`forms/${formId}`).update({
      responses,
    });
  });

  return firebase
    .firestore()
    .doc(`users/${userId}`)
    .update({ [`colaborators.${name}`]: firebase.firestore.FieldValue.delete() });
};
