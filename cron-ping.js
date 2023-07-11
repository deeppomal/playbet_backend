const cron = require('node-cron');
const axios = require('axios')
require('dotenv').config()

const fetchAllBets = () => {
    const options = {
        method: 'GET',
        url: 'https://playbet-backend-ptwt.onrender.com/bet/get-all-bets',
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
    newList.map(bet => checkFixtureResult(bet) )
}
const checkFixtureResult = async(bet) => {
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
        params: {id: bet.fixtureId},
        headers: {
          'X-RapidAPI-Key': process.env.RAPID_KEY,
          'X-RapidAPI-Host': process.env.RAPID_HOST
        }
    };
    try {
        const response = await axios.request(options);
        checkIFBetWon(response.data.response,bet)
    } catch (error) {
        console.error(error);
    }
}
const checkIFBetWon = async (list,bet) => {
    if(list[0].fixture.status.short === 'FT' || list[0].fixture.status.short === 'AET' || list[0].fixture.status.short === 'PEN'){
        let isWinner = bet?.selectedTeam?.toLowerCase() === checkWinner(list)
        updateBet(bet,isWinner)
        isWinner && updateUser(bet)
    }
}
const updateBet = async (bet,result) => {
    try {
        const response = await axios.patch('https://playbet-backend-ptwt.onrender.com/bet/update-bet/'+bet._id, {
            isResultChecked : true,
            hasWon : result,
            amountWon : result ? bet.expectedReturn : 0
        });
    } catch (error) {
        console.error(error);
    }
}
const updateUser = async (bet) => {
    try {
        const response = await axios.patch('https://playbet-backend-ptwt.onrender.com/auth/update-user/'+bet.userId, {balance :bet.expectedReturn});
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
module.exports = () => {  
    cron.schedule('0 20 * * *', function() {
        fetchAllBets()
    });    
}
