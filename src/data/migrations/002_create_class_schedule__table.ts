import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("class_schedule", (table) => {
    table.bigIncrements("id").primary();
    table.integer("week_day").notNullable();
    table.integer("from").notNullable();
    table.integer("to").notNullable();
    table
      .bigInteger("class_id")
      .notNullable()
      .references("id")
      .inTable("classes")
      .onDelete("cascade")
      .onUpdate("cascade");
  });
}

export async function down(knex: Knex) {
  knex.schema.dropTable("users");
}
