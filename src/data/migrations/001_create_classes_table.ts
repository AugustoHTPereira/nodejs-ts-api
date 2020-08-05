import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("classes", (table) => {
    table.bigIncrements("id").primary();
    table.string("subject", 255).notNullable();
    table.decimal("cost").notNullable();
    table
      .bigInteger("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("cascade")
      .onUpdate("cascade");
  });
}

export async function down(knex: Knex) {
  knex.schema.dropTable("users");
}
