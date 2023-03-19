const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const User = require('../models/user-model')

passport.serializeUser((user,done) => {
    done(null,user.id)
})
passport.deserializeUser((id,done) => {
    User.findById(id).then((user)=>{
        done(null,user)
    })
})

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL:'/auth/google/redirect'
        },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({googleId:profile.id}).then((currentUser)=>{
                if(currentUser){
                    done(null,currentUser)
                }
                else{
                    new User({
                        googleId: profile.id,
                        username: profile.displayName,
                        photo:profile.photos[0].value,
                        balance:1000
                    }).save().then((newUser) => {
                        done(null,newUser)
                    });
                }
            })
        }
    )
)