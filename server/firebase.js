const admin = require('firebase-admin');
const serviceAccount = require('./mchat-59ac3-firebase-adminsdk-ykhgu-c7765ff505.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://mchat-59ac3.firebasestorage.app',
});

const bucket = admin.storage().bucket();

module.exports = bucket;
