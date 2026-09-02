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

router
  .group(() => {
    router.get('signup', [controllers.Users, 'register_index']).as('auth.register.index')
    router.post('signup', [controllers.Users, 'register']).as('auth.register.store')

    router.get('login', [controllers.Users, 'login_index']).as('auth.login.index')
    router.post('login', [controllers.Users, 'login']).as('auth.login.store')
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Users, 'logout']).as('auth.logout')
  })
  .use(middleware.auth())
