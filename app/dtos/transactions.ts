import type { TransactionType } from '#models/transaction'

export interface CreateTransactionDTO {
  accountId: number
  type: TransactionType
  amount: number
  description?: string
  transactionDate: string
  categoryId?: number | null
  destinationAccountId?: number | null
}

export interface UpdateTransactionDTO {
  description?: string
  categoryId?: number | null
}
