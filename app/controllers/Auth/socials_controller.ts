import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SocialsController {
  //POUR GITHUB
  githubRedirect({ ally }: HttpContext) {
    ally.use('github').redirect((req) => {
      req.scopes(['user'])
    })
  }

  //Le callback est appelé après que le user qui souhaite s'autentifier accepte ou confirme l'utilisation de l'application tierce notamment Google ou Github pour s'autentifier
  async githubCallback({ ally, response, session, auth }: HttpContext) {
    const gh = await ally.use('github')

    /**
     * User has denied access by canceling
     * the login flow
     */
    if (gh.accessDenied()) {
      session.flash('success', "Autorisation d'accès annulée !")
      return response.redirect().toRoute('auth.login')
    }

    /**
     * OAuth state verification failed. This happens when the
     * CSRF cookie gets expired.
     */
    if (gh.stateMisMatch()) {
      session.flash('success', 'Echec de la vérification. Essayer encore !')
      return response.redirect().toRoute('auth.login')
    }

    /**
     * GitHub responded with some error
     */
    if (gh.hasError()) {
      session.flash('success', 'Echec de la connexion !')
      return response.redirect().toRoute('auth.login')
    }

    /**
     * Access user info
     */
    const githubUser = await gh.user()
    const person = await User.findBy('email', githubUser.email)
    if (!person) {
      const newPerson = await User.create({
        name: githubUser.name,
        email: githubUser.email,
        thumbnail: githubUser.avatarUrl,
        password: undefined,
      })
      await auth.use('web').login(newPerson)
    }
    await auth.use('web').login(person!) // Avec exclamation la je force les choses parce que si c'est pas l'un c'est l'autre. Des qu'on enleve le typeSafe le souligne en rouge
    session.flash('success', 'Connexion établie avec Github !')
    return response.redirect().toRoute('home')
  }

  //POUR GOOGLE (1)
  googleRedirect({ ally }: HttpContext) {
    ally.use('google').redirect((request) => {
      request.scopes(['profile', 'email'])
    })
  }
  //POUR GOOGLE (2)
  async googleCallback({ ally, response, session, auth }: HttpContext) {
    const google = ally.use('google')

    /**
     * User has denied access by canceling
     * the login flow
     */
    if (google.accessDenied()) {
      session.flash('success', "Autorisation d'accès annulée !")
      return response.redirect().toRoute('auth.login')
    }

    /**
     * OAuth state verification failed. This happens when the
     * CSRF cookie gets expired.
     */
    if (google.stateMisMatch()) {
      session.flash('success', 'Echec de la vérification. Essayer encore !')
      return response.redirect().toRoute('auth.login')
    }

    /**
     * GitHub responded with some error
     */
    if (google.hasError()) {
      session.flash('success', 'Echec de la connexion !')
      return response.redirect().toRoute('auth.login')
    }

    /**
     * Access user info
     * Si le user qui essaie de se connecter avec une application tierce est déja enrégistrer dans la base de données on le connecte à la plateforme directement, dans le cas ou il n'était pas enrégistrer on l'enrégistre
     */
    const googleUser = await google.user()
    const person = await User.findBy('email', googleUser.email)
    if (!person) {
      const newPerson = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        thumbnail: googleUser.avatarUrl,
        password: undefined,
      })
      await auth.use('web').login(newPerson)
    }
    await auth.use('web').login(person!) // Avec exclamation la je force les choses parce que si c'est pas l'un c'est l'autre. Des qu'on enleve le typeSafe le souligne en rouge
    session.flash('success', 'Connexion établie avec Google !')
    return response.redirect().toRoute('home')
  }
}
