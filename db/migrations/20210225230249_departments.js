const { onUpdateTrigger } = require('../knexfile');

exports.up = function (knex) {
  return knex.schema.createTable('departments', (t) => {
    t.increments('id').primary();
    t.string('name').notNullable();
    t.string('code').notNullable().unique();
    t.integer('tution_fee').notNullable();
    t.integer('terms').notNullable();
    t.timestamps(true, true);
  }).then(() => knex.raw(onUpdateTrigger('departments')));
};

exports.down = function (knex) {
  return knex.schema.dropTable('departments');
};
