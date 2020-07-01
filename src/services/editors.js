import firebase from '../firebase';

export const addEditors = ({ formId, editors }) => {
  return firebase.firestore().doc(`forms/${formId}`).update({ editors });
};
