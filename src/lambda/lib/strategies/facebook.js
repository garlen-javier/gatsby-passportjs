import { Router } from "express"
import passport from "passport"
import { Strategy } from "passport-facebook"

const router = Router()

router.use((req, _res, next) => {
  if (!passport._strategy(Strategy.name)) {
    passport.use(
      new Strategy(
        {
          clientID: "YOUR_FACEBOOK_APP_ID", //TODO: Change to your app ID
          clientSecret: "YOUR_FACEBOOK_CLIENT_SECRET", //TODO: Change to your client Secret
          //callbackURL: `http://localhost:9000/.netlify/functions/auth/facebook/callback`
          callbackURL: `/.netlify/functions/auth/facebook/callback`
        },
        async function (_accessToken, _refreshToken, profile, done) {
          console.info("load user profile", profile);
          const user = {
            id: profile.id,
            displayName: profile.displayName,
          }

          req.user = user
          return done(null, user)
        }
      )
    )
  }
  next()
})

router.get(
  "/facebook",
  passport.authenticate("facebook")
)

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  function callback(req, res) {
    return req.login(req.user, async function callbackLogin(loginErr) {
      if (loginErr) {
        throw loginErr
      }
      //return res.redirect("http://localhost:8000/welcome/?name=" + req.user.displayName)
      return res.redirect("/welcome/?name=" + req.user.displayName)
    })
  }
)

export default router
