const cron = require('node-cron');
const axios = require('axios')
require('dotenv').config()

const fetchAllBets = () => {
    const options = {
        method: 'GET',
        url: 'http://localhost:4000/bet/get-all-bets',
    };
    try{
        axios.request(options).then((response) => {
            checkIfChecked(response.data)
        })
    }catch (err){
        console.log('err',err)
    }
}
const checkIfChecked = (list) => {
    const newList = list.filter( item => item.isResultChecked == false)
    newList.map(bet => checkFixtureResult(bet.fixtureId))
}
const checkFixtureResult = async(id) => {
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
        params: {id: id},
        headers: {
          'X-RapidAPI-Key': process.env.RAPID_KEY,
          'X-RapidAPI-Host': process.env.RAPID_HOST
        }
    };
    try {
        const response = await axios.request(options);
        checkIFBetWon(response.data.response)
    } catch (error) {
        console.error(error);
    }
}
const checkIFBetWon = async (list) => {
    if(list[0].teams,list[0].fixture.status.short === 'FT'){
        let res = await fetchBet(list[0].fixture.id)
        let isWinner = res.data[0].selectedTeam.toLowerCase() === checkWinner(list)
        updateBet(res.data[0],isWinner)
        isWinner && updateUser(res.data[0])
    }
}
const updateBet = async (bet,result) => {
    try {
        const response = await axios.patch('http://localhost:4000/bet/update-bet/'+bet._id, {
            isResultChecked : true,
            hasWon : result,
            amountWon : result ? bet.expectedReturn : 0
        });
        console.log('updated bet',response.data)
    } catch (error) {
        console.error(error);
    }
}
const updateUser = async (bet) => {
    try {
        const response = await axios.patch('http://localhost:4000/auth/update-user/'+bet.userId, {balance :bet.expectedReturn});
        console.log('updated user',response.data)
    } catch (error) {
        console.error(error);
    }
}
const checkWinner = (list) => {
    if(list[0].teams.home.winner){
        return 'home'
    }
    else if(list[0].teams.away.winner){
        return 'away'
    }
    else{
        return 'draw'
    }
}
const fetchBet = (fixtureId) => {
    const options = {
        method: 'GET',
        url: 'http://localhost:4000/bet/get-bet/'+fixtureId,
    };
    try{
        return axios.request(options)
    }catch (err){
        console.log('err',err)
    }
}
module.exports = () => {  
    cron.schedule('* * * * * */10', function() {
        fetchAllBets()
    });    
}
