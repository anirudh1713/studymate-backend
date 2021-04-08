require('dotenv').config();

const app = require('./app');
const knex = require('./db/db');

const PORT = process.env.PORT || 3001;

knex.raw('select 1+1 as result').then(() => {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started on port ${PORT}`);
  });
}).catch((err) => {
  // eslint-disable-next-line no-console
  console.log(err);
  process.exit(1);
});
