const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cronUpdateSchema = new Schema({
    lastUpdate: String
})

const cronUpdate = mongoose.model('cronUpdate',cronUpdateSchema)

module.exports = cronUpdate