const { onUpdateTrigger } = require('../knexfile');

exports.up = function (knex) {
  return knex.schema.createTable('notice', (t) => {
    t.increments('id');
    t.string('title');
    t.string('description');
    t.integer('term_id')
      .references('terms.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.timestamps(true, true);
  }).then(() => knex.raw(onUpdateTrigger('notice')));
};

exports.down = function (knex) {
  return knex.schema.dropTable('notice');
};
