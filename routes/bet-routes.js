const router = require('express').Router()
const Bet = require('../models/bet-model');

router.get('/get-all-bets/:userId', async (req, res) => {
    try {
      const bets = await Bet.find({'userId':req.params.userId})
      res.status(201).json(bets)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
})
router.get('/get-all-bets', async (req, res) => {
  try {
    const bets = await Bet.find()
    res.status(201).json(bets)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
router.get('/get-bet/:fixtureId', async (req, res) => {
  try {
    const bets = await Bet.find({'fixtureId':req.params.fixtureId})
    res.status(201).json(bets)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
router.post('/add-bet', async (req, res) => {
    const bet = new Bet({
        userId:req.body.userId,
        fixtureId:req.body.fixtureId,
        home:req.body.home,
        away:req.body.away,
        betAmount:req.body.betAmount,
        expectedReturn:req.body.expectedReturn,
        selectedTeam:req.body.selectedTeam,
        hasWon:req.body.hasWon,
        amountWon:req.body.amountWon,
        oddsDetail:req.body.oddsDetail,
        isResultChecked:req.body.isResultChecked,
      })
      try {
        const newBet = await bet.save()
        res.status(201).json(newBet)
      } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.patch('/update-bet/:id', async (req, res) => {
    let update = {
      isResultChecked : req.body.isResultChecked,
      hasWon : req.body.hasWon,
      amountWon : req.body.amountWon
    }
    try {
      const bet = await Bet.findByIdAndUpdate(req.params.id, update, {
        new: true
      });
      res.status(201).json(bet);
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
})
async function getBet(req, res, next) {
    let bet
    try {
      bet = await Bet.findById(req.params.id)
      if (bet == null) {
        return res.status(404).json({ message: 'Cannot find this bet' })
      }
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  
    res.bet = bet
    next()
}
module.exports = router