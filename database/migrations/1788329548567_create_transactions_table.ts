import { BaseSchema } from '@adonisjs/lucid/schema'
import { TransactionType } from '#models/transaction'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()

      // Cuenta Origen
      table
        .bigInteger('account_id')
        .unsigned()
        .references('id')
        .inTable('accounts')
        .onDelete('CASCADE')
        .notNullable()

      // Cuenta Destino (Opcional, solo si type = 'transfer')
      table
        .bigInteger('destination_account_id')
        .unsigned()
        .references('id')
        .inTable('accounts')
        .onDelete('CASCADE')
        .nullable()

      table
        .bigInteger('category_id')
        .unsigned()
        .references('id')
        .inTable('categories')
        .onDelete('RESTRICT')
        .notNullable()

      table.enum('type', Object.values(TransactionType)).notNullable()

      table.decimal('amount', 15, 2).notNullable()
      table.string('description', 255).nullable()
      table.date('transaction_date').notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
