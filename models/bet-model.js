const mongoose = require('mongoose')
const Schema = mongoose.Schema

const betSchema = new Schema({
    userId:String,
    fixtureId:String,
    home:String,
    away:String,
    betAmount:Number,
    expectedReturn:Number,
    selectedTeam:String,
    hasWon:Boolean,
    amountWon:Number,
    oddsDetail:Array,
    isResultChecked:Boolean,
})

const Bet = mongoose.model('bet',betSchema)

module.exports = Bet