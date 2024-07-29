import { loginUserValidator, registerUserValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import { toPng } from 'jdenticon'
import { writeFile } from 'node:fs/promises'
import { promises as fsPromises } from 'node:fs'

export default class AuthController {
  register({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }
  login({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }
  async handleRegister({ request, session, response }: HttpContext) {
    const { name, email, thumbnail, password } = await request.validateUsing(registerUserValidator)

    // Vérifie si le dossier 'public/users' existe
    const usersDir = 'public/users'
    try {
      await fsPromises.access(usersDir)
    } catch (error) {
      // Si Le dossier n'existe pas, donc nous le créons
      await fsPromises.mkdir(usersDir, { recursive: true })
    }

    if (!thumbnail) {
      const png = toPng(name, 100)
      await writeFile(`public/users/${name}.png`, png)
    } else {
      await thumbnail.move(app.makePath('public/users/'), {
        name: `${cuid()}.${thumbnail.extname}`,
      })
    }

    const filePath = `users/${thumbnail?.fileName || name + '.png'}`
    await User.create({ name, email, thumbnail: filePath, password })
    session.flash('success', 'Enrégistrement éffectué avec succès !')
    return response.redirect().toRoute('auth.login')
  }

  async handleLogin({ request, auth, session, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginUserValidator)
    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)
    session.flash('success', 'Connexion éffectué avec succès !')
    return response.redirect().toRoute('home')
  }
}
