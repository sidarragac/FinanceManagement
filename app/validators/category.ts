import vine from '@vinejs/vine'

export const categoryValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(100),
  color: vine.string().trim().maxLength(20).optional(),
})

export const categoryUpdateValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(100).optional(),
  color: vine.string().trim().maxLength(20).optional(),
})
