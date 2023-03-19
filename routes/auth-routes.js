const passport = require('passport')

const router = require('express').Router()

router.get('/google',passport.authenticate('google',{
    scope:['profile']
}))

router.get('/logout', (req,res) => {

})

router.get('/google/redirect',passport.authenticate('google'),
// (err, req, res, next) => { // custom error handler to catch any errors, such as TokenError
//     console.log('err',err)
// },
(req,res) => {
    res.send(req.user)
})

module.exports = router