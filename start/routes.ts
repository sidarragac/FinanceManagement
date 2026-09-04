/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.get('/', [controllers.Home, 'index']).as('home')

// Authentication routes
router
  .group(() => {
    router.get('signup', [controllers.Users, 'register_index']).as('auth.register.index')
    router.post('signup', [controllers.Users, 'register']).as('auth.register.store')

    router.get('login', [controllers.Users, 'login_index']).as('auth.login.index')
    router.post('login', [controllers.Users, 'login']).as('auth.login.store')
  })
  .use(middleware.guest())

// Logout route
router
  .group(() => {
    router.post('logout', [controllers.Users, 'logout']).as('auth.logout')
  })
  .use(middleware.auth())

// Account routes
router
  .group(() => {
    router.get('accounts', [controllers.Accounts, 'index']).as('accounts.index')
    router.get('accounts/create', [controllers.Accounts, 'create']).as('accounts.create')
    router.post('accounts', [controllers.Accounts, 'store']).as('accounts.store')
    router.get('accounts/:id', [controllers.Accounts, 'show']).as('accounts.show')
    router.get('accounts/:id/edit', [controllers.Accounts, 'edit']).as('accounts.edit')
    router.patch('accounts/:id', [controllers.Accounts, 'update']).as('accounts.update')
    router.delete('accounts/:id', [controllers.Accounts, 'destroy']).as('accounts.destroy')
  })
  .use(middleware.auth())

// Category routes
router
  .group(() => {
    router.get('/categories', [controllers.Categories, 'index']).as('categories.index')
    router.get('/categories/create', [controllers.Categories, 'create']).as('categories.create')
    router.post('/categories', [controllers.Categories, 'store']).as('categories.store')
    router.get('/categories/:id/edit', [controllers.Categories, 'edit']).as('categories.edit')
    router.patch('/categories/:id', [controllers.Categories, 'update']).as('categories.update')
    router.delete('/categories/:id', [controllers.Categories, 'destroy']).as('categories.destroy')
  })
  .use(middleware.auth())

// Transaction routes
router
  .group(() => {
    router.get('/transactions', [controllers.Transactions, 'index']).as('transactions.index')
    router
      .get('/transactions/create', [controllers.Transactions, 'create'])
      .as('transactions.create')
    router.post('/transactions', [controllers.Transactions, 'store']).as('transactions.store')
    router.get('/transactions/:id/edit', [controllers.Transactions, 'edit']).as('transactions.edit')
    router
      .patch('/transactions/:id', [controllers.Transactions, 'update'])
      .as('transactions.update')
    router
      .delete('/transactions/:id', [controllers.Transactions, 'destroy'])
      .as('transactions.destroy')
  })
  .use(middleware.auth())
