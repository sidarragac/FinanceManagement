import type { HttpContext } from '@adonisjs/core/http'

import Account from '#models/account'
import Category from '#models/category'
import Transaction, { TransactionType } from '#models/transaction'
import TransactionService from '#services/transaction_service'
import { transactionValidator, transactionUpdateValidator } from '#validators/transaction'

export default class TransactionsController {
  async index({ auth, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const userAccountIds = await Account.query().where('userId', user.id).select('id')
    const ids = userAccountIds.map((acc) => acc.id)

    const transactions = await Transaction.query()
      .whereIn('accountId', ids)
      .preload('account')
      .preload('destinationAccount')
      .preload('category')
      .orderBy('transactionDate', 'desc')
      .orderBy('id', 'desc')

    const viewData = {
      title: 'Transacciones',
      transactions,
    }

    return view.render('pages/transactions/index', { viewData })
  }

  async create({ auth, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const accounts = await Account.query().where('userId', user.id).orderBy('name', 'asc')
    const categories = await Category.query()
      .whereNull('userId')
      .orWhere('userId', user.id)
      .orderBy('name', 'asc')

    const viewData = {
      title: 'Nueva Transacción',
      accounts,
      categories,
    }

    return view.render('pages/transactions/create', { viewData })
  }

  async store({ auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(transactionValidator)

    if (
      payload.type === TransactionType.TRANSFER &&
      payload.accountId === payload.destinationAccountId
    ) {
      session.flash('error', 'La cuenta origen y destino no pueden ser la misma.')
      return response.redirect().back()
    }

    try {
      await TransactionService.createTransaction(payload, user.id)
      session.flash('success', 'Transacción registrada y saldos actualizados correctamente.')
    } catch (error) {
      session.flash('error', `Ocurrió un error al procesar la transacción. ${error.message}`)
    }

    return response.redirect().toRoute('transactions.index')
  }

  async edit({ auth, params, view, response, session }: HttpContext) {
    const user = auth.getUserOrFail()

    // Cargar la transacción verificando pertenencia mediante la cuenta origen
    const transaction = await Transaction.query()
      .where('id', params.id)
      .whereHas('account', (query) => {
        query.where('userId', user.id)
      })
      .preload('account')
      .preload('destinationAccount')
      .first()

    if (!transaction) {
      session.flash('error', 'Transacción no encontrada.')
      return response.redirect().toRoute('transactions.index')
    }

    // Cargar categorías disponibles
    const categories = await Category.query()
      .whereNull('userId')
      .orWhere('userId', user.id)
      .orderBy('name', 'asc')

    const viewData = {
      title: `Editar Transacción #${transaction.id}`,
      transaction,
      categories,
    }

    return view.render('pages/transactions/edit', { viewData })
  }

  /**
   * Actualizar solo categoría y descripción
   * PUT /transactions/:id
   */
  async update({ auth, params, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()

    const transaction = await Transaction.query()
      .where('id', params.id)
      .whereHas('account', (query) => {
        query.where('userId', user.id)
      })
      .first()

    if (!transaction) {
      session.flash('error', 'No se encontró la transacción a actualizar.')
      return response.redirect().toRoute('transactions.index')
    }

    const payload = await request.validateUsing(transactionUpdateValidator)

    transaction.description = payload.description || null
    transaction.categoryId = payload.categoryId ? payload.categoryId : transaction.categoryId
    await transaction.save()

    session.flash('success', 'Transacción actualizada correctamente.')
    return response.redirect().toRoute('transactions.index')
  }

  async destroy({ auth, params, response, session }: HttpContext) {
    const user = auth.getUserOrFail()

    try {
      await TransactionService.deleteTransaction(params.id, user.id)
      session.flash('success', 'Transacción eliminada y saldos revertidos con éxito.')
    } catch {
      session.flash('error', 'No se pudo eliminar la transacción.')
    }

    return response.redirect().toRoute('transactions.index')
  }
}
