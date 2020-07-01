const admin = require('firebase-admin');
const serviceAccount = require('./functions/admin-credentials.json');
const neatCsv = require('neat-csv');
const fs = require('fs');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://reintegrapp-web.firebaseio.com',
});

const questions = {
  '﻿Employee ID': 'Nombre',
  'Es > 60 Años': 'Mayor de 60 Años',
  Comuna: 'Comuna',
  'Alguna situación familiar':
    'Dificultad en el hogar que dificulte el trabajo presencial',
  'Uso Transporte Público': 'Utiliza transporte público',
};

fs.readFile('./isa-data.csv', async (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const rows = await neatCsv(data, { separator: ';' });
  await uploadResponses(rows);
  await uploadColaborators(rows);
});

const diseasesArray = [
  'Mayor de 60 Años',
  'Obesidad',
  'Diabetes Mellitus',
  'Presión arterial alta',
  'Enfermedades del corazón',
  'Enfermedades del hígado',
  'Enfermedades crónicas del sistema respiratorio',
  'Enfermedad renal en diálisis',
  'Cáncer en tratamiento de quimioterapia',
  'Enfermedades o tratamientos que produzcan alteración del sistema inmunológico',
];

const uploadResponses = async (rows) => {
  const responses = {};
  const date = new Date();
  const timestamp = date.toISOString();

  rows.forEach((r) => {
    const data = [];
    Object.entries(questions).forEach(([k, v]) => {
      let answer = r[k];
      if (answer === 'Verde') answer = 'No';
      else if (answer === 'Rojo') answer = 'Sí';

      data.push({ question: v, answer });
    });

    const diseases = [];
    diseasesArray.forEach((d) => {
      if (r[d] === 'Sí') diseases.push(d);
    });
    if (diseases.length === 0) {
      data.push({ question: 'Enfermedades crónicas', answer: 'No' });
    } else {
      data.push({ question: 'Enfermedades crónicas', answer: diseases.join(' - ') });
    }

    const colaborator = r['﻿Employee ID'];

    responses[colaborator] = {
      data,
      colaborator,
      timestamp,
      verified: true,
    };
  });

  await admin
    .firestore()
    .doc('forms/1TU4RSnDdPg9Zr9BCGgOBqapZ1NSNDpwiKvgAFLMxyR4')
    .update({ responses });
};

const interestMap = {
  '': 'low',
  '1': 'medium',
  '2': 'high',
  '3': 'high',
};

const lightMap = {
  'Reintegro Programado': 'green',
  'Reintegro discutido': 'yellow',
  'Reintegro postergado': 'red',
  '#N/D': null,
};

const uploadColaborators = async (rows) => {
  const colaborators = {};

  rows.forEach((r) => {
    const colaborator = r['﻿Employee ID'];
    const interest = interestMap[r['Requerido por Negicio']];
    const light = lightMap[r['Segmentación']];

    const data = {
      area: r['Business Area'],
      interest,
      light,
      phone: null,
      productivity: null,
      state: 'remote',
      response: colaborator,
    };

    colaborators[colaborator] = data;
  });

  await admin
    .firestore()
    .doc('/users/OYAZonIS1KUhT3iKvRLJM9I4ixm2')
    .update({ colaborators });
};
