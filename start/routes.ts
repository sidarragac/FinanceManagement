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
    // router.get('accounts/:id', [controllers.Accounts, 'show']).as('accounts.show')
    router.get('accounts/:id/edit', [controllers.Accounts, 'edit']).as('accounts.edit')
    router.patch('accounts/:id', [controllers.Accounts, 'update']).as('accounts.update')
    router.delete('accounts/:id', [controllers.Accounts, 'destroy']).as('accounts.destroy')
  })
  .use(middleware.auth())
