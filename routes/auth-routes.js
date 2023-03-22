const passport = require('passport')
const User = require('../models/user-model')

const router = require('express').Router()

router.get('/google',passport.authenticate('google',{
    scope:['profile']
}))

router.post('/add-user', async (req, res) => {
    User.findOne({googleId:req.body.googleId}).then((currentUser)=>{
        if(currentUser){
            res.status(201).json(currentUser)
        }
        else{
            const user = new User({
                username:req.body.username,
                userEmail:req.body.userEmail,
                googleId:req.body.googleId,
                photo:req.body.photo,
                balance:req.body.balance
              })
              try {
                const newUser = user.save()
                res.status(201).json(user)
              } catch (err) {
                res.status(400).json({ message: err.message })
            }
        }
    })
})

router.get('/logout', (req,res) => {
    req.logout()
    res.status(201).json({"message":"logged out successfully"})
})

router.get('/google/redirect',passport.authenticate('google'),
// (err, req, res, next) => { // custom error handler to catch any errors, such as TokenError
//     console.log('err',err)
// },
(req,res) => {
    res.status(201).json(req.user)
})

module.exports = router