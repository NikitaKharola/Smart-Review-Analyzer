const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const prisma = require("../prismaClient");

/**
 * We never use Passport sessions (session: false everywhere this is used) —
 * the app is fully stateless JWT, same as password login. This strategy's
 * only job is: given a verified Google profile, return the matching row in
 * our own `users` table (creating one if this is a first-time sign-in), so
 * authRoutes.js can sign our normal JWT for it afterward.
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google account has no public email."), null);
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
          // Account already exists (maybe from password signup). Link it to
          // this Google identity if it isn't linked yet, so next time they
          // can sign in with either method.
          if (user.provider === "local") {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { provider: "google", providerId: profile.id },
            });
          }
        } else {
          user = await prisma.user.create({
            data: {
              email,
              fullName: profile.displayName || null,
              provider: "google",
              providerId: profile.id,
              // password stays null — this account can only sign in via Google
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;