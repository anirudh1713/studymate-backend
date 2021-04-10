const { onUpdateTrigger } = require('../knexfile');

exports.up = function (knex) {
  return knex.schema.createTable('terms', (t) => {
    t.increments('id').primary();
    t.string('name').notNullable();
    t.integer('duration').notNullable();
    t.integer('department_id')
      .references('departments.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.timestamps(true, true);
  }).then(() => knex.raw(onUpdateTrigger('terms')));
};

exports.down = function (knex) {
  return knex.schema.dropTable('terms');
};
