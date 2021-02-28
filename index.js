require('dotenv').config();
const express = require('express');
const cors = require('cors');

const knex = require('./db/db');
const routes = require('./routes');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.use('/api/v1', routes);


knex.raw('select 1+1 as result').then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}).catch(err => {
  console.log(err);
  process.exit(1);
});
