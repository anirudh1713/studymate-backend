const { onUpdateTrigger } = require('../knexfile');

exports.up = function (knex) {
  return knex.schema.createTable('subjects', (t) => {
    t.increments('id');
    t.string('name');
    t.string('code').notNullable().unique();
    t.integer('term_id')
      .notNullable()
      .references('terms.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.timestamps(true, true);
  }).then(() => knex.raw(onUpdateTrigger('subjects')));
};

exports.down = function (knex) {
  return knex.schema.dropTable('subjects');
};
