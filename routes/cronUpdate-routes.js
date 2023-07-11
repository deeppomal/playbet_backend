const cronUpdate = require('../models/cronUpdate-model')

const router = require('express').Router()

router.post('/update-latest', async (req, res) => {
    const cron = new cronUpdate({
        lastUpdate: req.body.lastUpdate
      })
      try {
        const newCron = cron.save()
        res.status(201).json(cron)
      } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = router