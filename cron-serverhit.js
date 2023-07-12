const cronHit = require('node-cron');
const axios = require('axios')
require('dotenv').config()

module.exports = () => {  
    cronHit.schedule('*/50 * * * * *', async function() {
        const options = {
            method: 'GET',
            url: 'https://playbet-backend-ptwt.onrender.com/bet/get-all-bets',
        };
        try{
            let res = await axios.request(options)
            console.log(res?.data?.length)
        }catch (err){
            console.log('err',err)
        }
    });    
}
