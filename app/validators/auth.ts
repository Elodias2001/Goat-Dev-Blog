import vine from '@vinejs/vine'

/**
 * Validates the post's creation action
 */
export const registerUserValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(4)
      .alphaNumeric()
      .unique(async (db, value) => {
        const person = await db.from('users').where('name', value).first()
        return !person
        //Si on trouve quelqu'un qui porte ce nom dans la table users on renvoi false
      }),
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const person = await db.from('users').where('email', value).first()
        return !person
      }),
    password: vine.string().minLength(8),
    thumbnail: vine.file({ extnames: ['jpg', 'png', 'JPG', 'PNG'], size: '10mb' }).optional(),
  })
)

export const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8),
  })
)

export const forgotPasswordUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)

export const resetPasswordUserValidator = vine.compile(
  vine.object({
    token: vine.string(),
    email: vine.string().email(),
    password: vine.string().minLength(8).confirmed(),
  })
)
