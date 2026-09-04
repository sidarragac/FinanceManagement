import vine from '@vinejs/vine'

import { TransactionType } from '#models/transaction'

export const transactionValidator = vine.create({
  accountId: vine.number().positive(),
  type: vine.enum(Object.values(TransactionType)),
  amount: vine.number().positive(),
  description: vine.string().trim().maxLength(255).optional(),
  transactionDate: vine.string(),

  categoryId: vine.number().positive(),

  // Cuenta destino obligatoria solo en transferencias
  destinationAccountId: vine
    .number()
    .positive()
    .optional()
    .requiredWhen('type', '=', TransactionType.TRANSFER),
})

export const transactionUpdateValidator = vine.create({
  description: vine.string().trim().maxLength(255).optional(),
  categoryId: vine.number().positive().nullable().optional(),
})
