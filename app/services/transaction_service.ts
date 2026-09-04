import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

import Account from '#models/account'
import type { CreateTransactionDTO } from '#dtos/transaction'
import Transaction, { TransactionType } from '#models/transaction'

export default class TransactionService {
  static async createTransaction(data: CreateTransactionDTO, userId: number) {
    return await db.transaction(async (trx) => {
      const sourceAccount = await Account.query({ client: trx })
        .where('id', data.accountId)
        .where('userId', userId)
        .firstOrFail()

      let destinationAccount: Account | null = null
      if (data.type === TransactionType.TRANSFER && data.destinationAccountId) {
        destinationAccount = await Account.query({ client: trx })
          .where('id', data.destinationAccountId)
          .where('userId', userId)
          .firstOrFail()
      }

      if (sourceAccount.initialBalance < data.amount && data.type !== TransactionType.INCOME) {
        throw new Error('Saldo insuficiente en la cuenta de origen.')
      }

      const transaction = new Transaction()
      transaction.accountId = data.accountId
      transaction.categoryId = data.categoryId
      transaction.destinationAccountId =
        data.type === TransactionType.TRANSFER ? data.destinationAccountId || null : null
      transaction.type = data.type
      transaction.amount = data.amount
      transaction.description = data.description || null
      transaction.transactionDate = DateTime.fromISO(data.transactionDate)

      transaction.useTransaction(trx)
      await transaction.save()

      if (data.type === TransactionType.EXPENSE) {
        sourceAccount.initialBalance = Number(sourceAccount.initialBalance) - data.amount
        await sourceAccount.save()
      } else if (data.type === TransactionType.INCOME) {
        sourceAccount.initialBalance = Number(sourceAccount.initialBalance) + data.amount
        await sourceAccount.save()
      } else if (data.type === TransactionType.TRANSFER && destinationAccount) {
        sourceAccount.initialBalance = Number(sourceAccount.initialBalance) - data.amount
        await sourceAccount.save()

        destinationAccount.initialBalance = Number(destinationAccount.initialBalance) + data.amount
        await destinationAccount.save()
      }

      return transaction
    })
  }

  static async deleteTransaction(transactionId: number, userId: number) {
    return await db.transaction(async (trx) => {
      const transaction = await Transaction.query({ client: trx })
        .where('id', transactionId)
        .whereHas('account', (query) => {
          query.where('userId', userId)
        })
        .firstOrFail()

      const sourceAccount = await Account.findOrFail(transaction.accountId, { client: trx })

      if (transaction.type === TransactionType.EXPENSE) {
        sourceAccount.initialBalance =
          Number(sourceAccount.initialBalance) + Number(transaction.amount)
        await sourceAccount.save()
      } else if (transaction.type === TransactionType.INCOME) {
        sourceAccount.initialBalance =
          Number(sourceAccount.initialBalance) - Number(transaction.amount)
        await sourceAccount.save()
      } else if (
        transaction.type === TransactionType.TRANSFER &&
        transaction.destinationAccountId
      ) {
        sourceAccount.initialBalance =
          Number(sourceAccount.initialBalance) + Number(transaction.amount)
        await sourceAccount.save()

        const destAccount = await Account.findOrFail(transaction.destinationAccountId, {
          client: trx,
        })

        destAccount.initialBalance = Number(destAccount.initialBalance) - Number(transaction.amount)
        await destAccount.save()
      }

      await transaction.delete()
    })
  }
}
