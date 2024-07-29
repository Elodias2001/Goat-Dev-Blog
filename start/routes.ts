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

// router.on('/').render('pages/home')

router.get('/', [HomeController, 'home']).as('home')

router.get('/register', [AuthController, 'register']).as('auth.register')
router.post('/register', [AuthController, 'handleRegister']).as('handleRegister')

router.get('/login', [AuthController, 'login']).as('auth.login')
router.post('/login', [AuthController, 'handleLogin']).as('handleLogin')
router.delete('/login', [AuthController, 'logout']).as('auth.logout')
