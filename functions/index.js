const admin = require('firebase-admin');
const axios = require('axios');
const cors = require('cors');
const express = require('express');
const functions = require('firebase-functions');
const serviceAccount = require('./admin-credentials.json');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://reintegrapp-web.firebaseio.com',
});

exports.createUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }
  const uid = context.auth.uid;
  const userDoc = await admin.firestore().collection('users').doc(uid).get();
  if (!userDoc.exists) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'invalid-auth-parameters'
    );
  }

  const newRole = data.role;
  const role = userDoc.data().role;

  if (!role || newRole >= role) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'You do not have enough permissions.'
    );
  }

  const { username, password } = data;
  const email = username + '@reintegrapp.cl';

  const newUserUid = await admin
    .auth()
    .createUser({ email, password })
    .then((userRecord) => userRecord.uid)
    .catch((err) => {
      throw new functions.https.HttpsError('already-exists', err);
    });

  const res = await axios({
    method: 'POST',
    url: functions.config().forms.endpoint,
    data: { username, action: 'create_forms' },
  });

  const { basalFormId, dailyFormId } = res.data;

  await admin
    .firestore()
    .collection('users')
    .doc(newUserUid)
    .set({
      role: newRole,
      basalFormId,
      dailyFormId,
      name: null,
      areas: {},
      colaborators: {},
    })
    .catch(function (err) {
      throw new functions.https.HttpsError('unknown', err.message);
    });

  [basalFormId, dailyFormId].forEach(async (formId) => {
    await admin
      .firestore()
      .collection('forms')
      .doc(formId)
      .set({ responses: {}, editors: [], userId: newUserUid })
      .catch(function (err) {
        throw new functions.https.HttpsError('unknown', err.message);
      });
  });

  return;
});

exports.onUpdateForm = functions.firestore
  .document('forms/{formID}')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    if (JSON.stringify(newValue.editors) !== JSON.stringify(previousValue.editors)) {
      const addedEditors = newValue.editors.filter(
        (e) => !previousValue.editors.includes(e)
      );
      const removedEditors = previousValue.editors.filter(
        (e) => !newValue.editors.includes(e)
      );

      await axios({
        method: 'POST',
        url: functions.config().forms.endpoint,
        data: {
          formId: change.after.id,
          addedEditors,
          removedEditors,
          action: 'update_editors',
        },
      });
    }

    return change.after.data();
  });

exports.onUpdateUser = functions.firestore
  .document('users/{userID}')
  .onUpdate((change, context) => {
    const newColaborators = Object.keys(change.after.data().colaborators);
    const previousColaborators = Object.keys(change.before.data().colaborators);
    if (JSON.stringify(newColaborators) !== JSON.stringify(previousColaborators)) {
      [change.after.data().basalFormId, change.after.data().dailyFormId].forEach(
        async (formId) => {
          await axios({
            method: 'POST',
            url: functions.config().forms.endpoint,
            data: {
              formId,
              newColaborators,
              action: 'update_colaborators',
            },
          });
        }
      );
    }

    if (change.before.data().name !== change.after.data().name) {
      [change.after.data().basalFormId, change.after.data().dailyFormId].forEach(
        async (formId) => {
          await axios({
            method: 'POST',
            url: functions.config().forms.endpoint,
            data: {
              formId,
              title: change.after.data().name,
              formType:
                formId === change.after.data().basalFormId ? 'Basal' : 'Diario',
              action: 'update_title',
            },
          });
        }
      );
    }
    return change.after.data();
  });

app.post('/', async (req, res) => {
  const { formId, timestamp, id } = req.body;
  const responses = JSON.parse(req.body.responses);
  const response = {
    timestamp,
    colaborator: null,
    verified: false,
    data: responses,
  };

  let colaborator = responses[0].answer;
  if (colaborator !== 'Otro') {
    const formDoc = await admin.firestore().doc(`forms/${formId}`).get();
    const userId = formDoc.data().userId;
    await admin
      .firestore()
      .doc(`users/${userId}`)
      .update({
        [`colaborators.${colaborator}.response`]: id,
      });
  }

  admin
    .firestore()
    .doc(`forms/${formId}`)
    .update({
      [`responses.${id}`]: response,
    })
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(500));
});

exports.responses = functions.https.onRequest(app);
