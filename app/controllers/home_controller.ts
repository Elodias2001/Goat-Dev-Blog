import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  home({ view }: HttpContext) {
    return view.render('pages/home')
  }
}
