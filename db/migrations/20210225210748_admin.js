const { onUpdateTrigger } = require("../knexfile");

exports.up = function(knex) {
  return knex.schema.createTable('admins', t => {
    t.increments('id').primary();
    t.string('name', 255).notNullable();
    t.string('email', 255).notNullable().unique();
    t.string('phone_number').notNullable().unique();
    t.string('password').notNullable();
    t.timestamps(true, true);
  })
  .then(() => knex.raw(onUpdateTrigger('admins')));  
};

exports.down = function(knex) {
  return knex.schema.dropTable('admins');
};
