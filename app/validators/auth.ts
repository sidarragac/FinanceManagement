import vine from '@vinejs/vine'

export const registerValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(100),
  email: vine
    .string()
    .email()
    .normalizeEmail()
    .unique(async (db, value) => {
      const user = await db.from('users').where('email', value).first()
      return !user
    }),
  password: vine.string().minLength(8).maxLength(32),
})

export const loginValidator = vine.create({
  email: vine.string().email().normalizeEmail(),
  password: vine.string(),
})
