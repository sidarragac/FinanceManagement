import { BaseSchema } from '@adonisjs/lucid/schema'

import { AccountType } from '#models/account'

export default class extends BaseSchema {
  protected tableName = 'accounts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()

      table
        .bigInteger('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()

      table.string('name', 100).notNullable()
      table.enum('type', Object.values(AccountType)).notNullable()
      table.decimal('initial_balance', 15, 2).notNullable().defaultTo(0.0)

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
