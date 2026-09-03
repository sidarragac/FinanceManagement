import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import { categoryValidator } from '#validators/category'

export default class CategoriesController {
  async index({ auth, view }: HttpContext) {
    const user = auth.getUserOrFail()

    const categories = await Category.query().where('userId', user.id).orderBy('name', 'asc')

    const viewData = {
      title: 'Categorías',
      categories,
    }

    return view.render('pages/categories/index', { viewData })
  }

  async create({ view }: HttpContext) {
    const viewData = {
      title: 'Nueva Categoría',
    }

    return view.render('pages/categories/create', { viewData })
  }

  async store({ auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(categoryValidator)

    try {
      const category = new Category()
      category.userId = user.id
      category.name = payload.name
      category.color = payload.color || '#4F46E5'
      await category.save()

      session.flash('success', 'Categoría creada correctamente')

      return response.redirect().toRoute('categories.index')
    } catch (error) {
      session.flash('error', 'Error al crear la categoría.')
      return response.redirect().back()
    }
  }

  async edit({ auth, params, view, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const category = await Category.query().where('id', params.id).where('userId', user.id).first()

    if (!category) {
      session.flash('error', 'La categoría no existe o no tienes permiso para editarla.')
      return response.redirect().toRoute('categories.index')
    }

    const viewData = {
      title: `Editar Categoría: ${category.name}`,
      category,
    }

    return view.render('pages/categories/edit', { viewData })
  }

  async update({ auth, params, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()

    const category = await Category.query().where('id', params.id).where('userId', user.id).first()

    if (!category) {
      session.flash('error', 'No se pudo actualizar la categoría.')
      return response.redirect().toRoute('categories.index')
    }

    const payload = await request.validateUsing(categoryValidator)

    category.name = payload.name
    category.color = payload.color || category.color
    await category.save()

    session.flash('success', 'Categoría actualizada exitosamente')
    return response.redirect().toRoute('categories.index')
  }

  async destroy({ auth, params, response, session }: HttpContext) {
    const user = auth.getUserOrFail()

    const category = await Category.query().where('id', params.id).where('userId', user.id).first()

    if (!category) {
      session.flash('error', 'No se pudo eliminar la categoría.')
      return response.redirect().toRoute('categories.index')
    }

    await category.delete()

    session.flash('success', 'Categoría eliminada con éxito')
    return response.redirect().toRoute('categories.index')
  }
}
