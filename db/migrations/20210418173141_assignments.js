const { onUpdateTrigger } = require('../knexfile');

exports.up = function (knex) {
  return knex.schema.createTable('assignments', (t) => {
    t.increments('id');
    t.string('title');
    t.string('description');
    t.integer('subject_id')
      .notNullable()
      .references('subjects.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.integer('faculty_id')
      .notNullable()
      .references('faculties.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    t.timestamps(true, true);
  }).then(() => knex.raw(onUpdateTrigger('assignments')));
};

exports.down = function (knex) {
  return knex.schema.dropTable('assignments');
};
