const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoute');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors());
app.use('/api/users', userRoute);

app.post('', () => {});

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

app.listen(port, (req, res) => {
  console.log(`server: ${port}`);
});

app.get('/login', async (req, res) => {
  console.log('login');
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('mongo connnected ');
  })
  .catch(err => {
    console.log(`mongo error ${err.message}`);
  });
