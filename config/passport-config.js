const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const { validateEmail } = require('../reusable/misc_reuse')

async function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    if(!validateEmail(email)){
      return done(null, false, { message: 'The email is not a valid email.' })
    }
    if (password.length < 6){
      return done(null, false, { message: 'The password is not a valid password.' })
    }
    const user = await getUserByEmail(email)
    if (user == null) {
      return done(null, false, { message: 'There is no user with That email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'The Password you have entered is inncorrect.' })
      }
    } catch (e) {
      console.log(e)
      return done(e)
    }
  }

  await passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  await passport.serializeUser((user, done) => done(null, user.id))
  await passport.deserializeUser(async (id, done) => {
    let usertoreturn = await getUserById(id)
    return done(null, usertoreturn)
  })
}

module.exports = initialize
