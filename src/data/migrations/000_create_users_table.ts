import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("users", (table) => {
    table.bigIncrements("id").primary();
    table.string("name", 255).notNullable();
    table.string("avatar").notNullable();
    table.string("whatsapp").notNullable();
    table.string("bio").notNullable();
  });
}

export async function down(knex: Knex) {
  knex.schema.dropTable("users");
}
