const { ValidationError } = require('joi');

const knex = require('../db/db');

const duplicate = async (table, prop, value) => {
  const data = await knex(table).where({ [prop]: value }).select('*');
  if (data.length >= 1) {
    throw new ValidationError(`${prop} already in use.`);
  }
  return data;
};

const exists = async (table, prop, value) => {
  const data = await knex(table).where({ [prop]: value }).select('*');
  if (data.length !== 1) {
    throw new ValidationError(`${prop} does not exists.`);
  }
};

module.exports = {
  duplicate,
  exists,
};
