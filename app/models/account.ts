import { AccountSchema } from '#database/schema'

export enum AccountType {
  Cash = 'cash',
  Bank = 'bank',
  CreditCard = 'credit_card',
}

export default class Account extends AccountSchema {
  get accountId() {
    return this.id
  }

  get accountUserId() {
    return this.userId
  }

  get accountName() {
    return this.name
  }

  get accountType() {
    return this.type as AccountType
  }

  get accountInitialBalance() {
    return this.initialBalance
  }

  get accountCreatedAt() {
    return this.createdAt
  }

  get accountUpdatedAt() {
    return this.updatedAt
  }

  set accountName(name: string) {
    this.name = name
  }

  set accountType(type: AccountType) {
    this.type = type
  }

  set accountInitialBalance(initialBalance: string) {
    this.initialBalance = initialBalance
  }
}
