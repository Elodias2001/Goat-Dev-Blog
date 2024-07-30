/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const HomeController = () => import('#controllers/home_controller')
const AuthController = () => import('#controllers/Auth/auth_controller')
import { middleware } from '#start/kernel'
const SocialsController = () => import('#controllers/Auth/socials_controller')

// router.on('/').render('pages/home')
router.get('/', [HomeController, 'home']).as('home')

router
  .group(() => {
    router.get('/register', [AuthController, 'register']).as('auth.register')
    router.post('/register', [AuthController, 'handleRegister']).as('handleRegister')

    router.get('/login', [AuthController, 'login']).as('auth.login')
    router.post('/login', [AuthController, 'handleLogin']).as('handleLogin')

    router.get('/github/redirect', [SocialsController, 'githubRedirect']).as('github.redirect')
    router.get('/github/callback', [SocialsController, 'githubCallback']).as('github.callback')

    router.get('/google/redirect', [SocialsController, 'googleRedirect']).as('google.redirect')
    router.get('/google/callback', [SocialsController, 'googleCallback']).as('google.callback')
  })
  .use(middleware.guest())
router.delete('/login', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())
