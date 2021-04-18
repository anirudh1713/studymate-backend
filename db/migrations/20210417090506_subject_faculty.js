const { onUpdateTrigger } = require('../knexfile');

exports.up = function (knex) {
  return knex.schema.createTable('subject_faculty', (t) => {
    t.increments('id');
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
  }).then(() => knex.raw(onUpdateTrigger('subject_faculty')));
};

exports.down = function (knex) {
  return knex.schema.dropTable('subject_faculty');
};
