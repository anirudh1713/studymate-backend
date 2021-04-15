exports.up = function (knex) {
  return knex.schema.alterTable('notice', (t) => {
    t.integer('department_id')
      .references('departments.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('notice', (t) => {
    t.dropForeign('department_id');
    t.dropColumn('department_id');
  });
};
