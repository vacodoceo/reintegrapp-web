import firebase from '../firebase';

export const updateResponse = async ({
  formId,
  responseId,
  key,
  value,
  userId = null,
}) => {
  if (key === 'colaborator') {
    const formDoc = await firebase.firestore().doc(`forms/${formId}`).get();
    const colaborator = formDoc.data().responses[responseId].colaborator;
    if (colaborator) {
      await firebase
        .firestore()
        .doc(`users/${userId}`)
        .update({ [`colaborators.${colaborator}.response`]: null });
    }
  }
  return firebase
    .firestore()
    .doc(`forms/${formId}`)
    .update({
      [`responses.${responseId}.${key}`]: value,
    });
};
