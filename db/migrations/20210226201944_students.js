const { onUpdateTrigger } = require("../knexfile");

exports.up = function(knex) {
  return knex.schema.createTable('students', t => {
    t.increments('id').primary();
    t.string('name').notNullable();
    t.string('email').notNullable().unique();
    t.string('phone_number').notNullable().unique();
    t.string('password').notNullable();
    t.string('enrollment_number').notNullable().unique();
    t.integer('department_id')
      .references('departments.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.timestamps(true, true);
  }).then(() => knex.raw(onUpdateTrigger('students')));
};

exports.down = function(knex) {
  return knex.schema.dropTable('students');
};
