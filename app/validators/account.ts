import vine from '@vinejs/vine'

import { AccountType } from '#models/account'

export const accountValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(100),
  type: vine.enum(Object.values(AccountType)),
  initialBalance: vine.number().min(0),
})

export const accountUpdateValidator = vine.create(accountValidator.schema.partial())
