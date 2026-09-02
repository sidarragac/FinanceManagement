import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

import Account from '#models/account'
import Category from '#models/category'

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare accountId: number

  @column()
  declare categoryId: number

  @column()
  declare type: TransactionType

  @column()
  declare amount: number

  @column()
  declare description: string | null

  // Only if it's a internal transfer (transfer type)
  @column()
  declare destinationAccountId: number | null

  @column.date()
  declare transactionDate: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relación: Una transacción pertenece a una Cuenta
  @belongsTo(() => Account)
  declare account: BelongsTo<typeof Account>

  // Relación: Una transacción pertenece a una Categoría
  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>
}
