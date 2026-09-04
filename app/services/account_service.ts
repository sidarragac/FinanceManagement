import { AccountMetricsDTO } from '#dtos/account.dto'
import Transaction, { TransactionType } from '#models/transaction'

export default class AccountService {
  static async calculateAccountMetrics(accountId: number): Promise<AccountMetricsDTO> {
    const transactions = await Transaction.query().where((query) => {
      query.where('accountId', accountId).orWhere('destinationAccountId', accountId)
    })

    let totalIncomes = 0
    let totalExpenses = 0

    for (const tx of transactions) {
      const amount = Number(tx.amount)

      // Es Ingreso si: es de tipo INCOME o si es TRANSFERENCIA y la cuenta actúa como DESTINO
      if (
        tx.type === TransactionType.INCOME ||
        (tx.type === TransactionType.TRANSFER && tx.destinationAccountId === accountId)
      ) {
        totalIncomes += amount
      }
      // Es Gasto si: es de tipo EXPENSE o si es TRANSFERENCIA y la cuenta actúa como ORIGEN
      else if (
        tx.type === TransactionType.EXPENSE ||
        (tx.type === TransactionType.TRANSFER && tx.accountId === accountId)
      ) {
        totalExpenses += amount
      }
    }

    return {
      totalIncomes,
      totalExpenses,
    }
  }
}
