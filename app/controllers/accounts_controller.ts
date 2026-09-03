import type { HttpContext } from '@adonisjs/core/http'

import Account from '#models/account'
import { accountValidator, accountUpdateValidator } from '#validators/account'

export default class AccountsController {
  async index({ auth, view }: HttpContext) {
    const user = auth.getUserOrFail()

    const accounts = await Account.query().where('userId', user.id).orderBy('name', 'asc')

    const totalBalance = accounts.reduce((acc, account) => acc + Number(account.initialBalance), 0)

    const viewData = {
      title: 'Mis Cuentas',
      accounts,
      totalBalance,
    }

    return view.render('pages/accounts/index', { viewData: viewData })
  }

  async create({ view }: HttpContext) {
    const viewData = {
      title: 'Nueva Cuenta',
    }

    return view.render('pages/accounts/create', { viewData })
  }

  async store({ auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(accountValidator)

    console.log('Payload:', payload) // Log the payload to check its contents
    console.log('User ID:', user.id) // Log the user ID to ensure it's being retrieved correctly

    try {
      const account = new Account()
      account.userId = user.id
      account.name = payload.name
      account.type = payload.type
      account.initialBalance = payload.initialBalance
      await account.save()

      session.flash('success', 'Cuenta creada correctamente')

      return response.redirect().toRoute('accounts.index')
    } catch (error) {
      session.flash('error', 'Error al crear la cuenta.')

      return response.redirect().back()
    }
  }

  /**
   * Mostrar el detalle de una cuenta con sus transacciones
   * GET /accounts/:id
   */
  // async show({ auth, params, view, response, session }: HttpContext) {
  //   const user = auth.getUserOrFail()

  //   const account = await Account.query()
  //     .where('id', params.id)
  //     .where('userId', user.id)
  //     .first()

  //   if (!account) {
  //     session.flash('error', 'La cuenta solicitada no existe o no tienes acceso.')
  //     return response.redirect().toRoute('accounts.index')
  //   }

  //   const viewData = {
  //     title: `Cuenta: ${account.name}`,
  //     account,
  //   }

  //   return view.render('pages/accounts/show', { viewData })
  // }

  /**
   * Mostrar formulario de edición
   * GET /accounts/:id/edit
   */
  async edit({ auth, params, view, response, session }: HttpContext) {
    const user = auth.getUserOrFail()

    const account = await Account.query().where('id', params.id).where('userId', user.id).first()

    if (!account) {
      session.flash('error', 'La cuenta no fue encontrada.')
      return response.redirect().toRoute('accounts.index')
    }

    const viewData = {
      title: `Editar Cuenta: ${account.name}`,
      account,
    }

    return view.render('pages/accounts/edit', { viewData })
  }

  /**
   * Actualizar una cuenta existente
   * PUT /accounts/:id
   */
  async update({ auth, params, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const account = await Account.query().where('id', params.id).where('userId', user.id).first()

    if (!account) {
      session.flash('error', 'No se pudo encontrar la cuenta a actualizar.')
      return response.redirect().toRoute('accounts.index')
    }

    const payload = await request.validateUsing(accountUpdateValidator)

    account.name = payload.name ? payload.name : account.name
    account.type = payload.type ? payload.type : account.type
    account.initialBalance = payload.initialBalance
      ? payload.initialBalance
      : account.initialBalance

    await account.save()

    session.flash('success', 'Cuenta actualizada exitosamente')
    return response.redirect().toRoute('accounts.index')
  }

  async destroy({ auth, params, response, session }: HttpContext) {
    const user = auth.getUserOrFail()

    const account = await Account.query().where('id', params.id).where('userId', user.id).first()

    if (!account) {
      session.flash('error', 'No se pudo eliminar la cuenta.')
      return response.redirect().toRoute('accounts.index')
    }

    await account.delete()

    session.flash('success', 'Cuenta eliminada con éxito')
    return response.redirect().toRoute('accounts.index')
  }
}
