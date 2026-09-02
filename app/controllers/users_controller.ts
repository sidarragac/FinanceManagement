import type { HttpContext } from '@adonisjs/core/http'

import { loginValidator, registerValidator } from '#validators/auth'
import User from '#models/user'

export default class UsersController {
  async login_index({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  async login({ request, response, auth, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      session.flash('success', '¡Bienvenido de nuevo!')

      return response.redirect().toRoute('home')
    } catch {
      session.flash('error', 'Credenciales inválidas. Por favor, inténtalo de nuevo.')

      return response.redirect().back()
    }
  }

  async register_index({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async register({ request, response, auth, session }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    try {
      const user = await User.create(payload)

      await auth.use('web').login(user)

      session.flash('success', '¡Registro exitoso! Bienvenido a la aplicación.')

      return response.redirect().toRoute('home')
    } catch (error) {
      session.flash('error', 'Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.')

      return response.redirect().back()
    }
  }

  async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()

    return response.redirect().toRoute('home')
  }
}
