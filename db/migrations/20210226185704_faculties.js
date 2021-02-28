const { onUpdateTrigger } = require("../knexfile");

exports.up = function(knex) {
  return knex.schema.createTable('faculties', t => {
    t.increments('id').primary();
    t.string('name').notNullable();
    t.string('email').notNullable().unique();
    t.string('phone_number', 15).notNullable().unique();
    t.string('password').notNullable();
    t.integer('department_id')
      .references('departments.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.timestamps(true, true);
  }).then(() => knex.raw(onUpdateTrigger('faculties')));
};

exports.down = function(knex) {
  return knex.schema.dropTable('faculties');
};
