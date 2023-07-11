const cronHit = require('node-cron');
const axios = require('axios')
require('dotenv').config()

module.exports = () => {  
    cronHit.schedule('*/2 * * * *', function() {
        const options = {
            method: 'GET',
            url: 'https://playbet-backend-ptwt.onrender.com/bet/get-all-bets',
        };
        try{
            axios.request(options).then((response) => {
                // console.log(response.data)
            })
        }catch (err){
            console.log('err',err)
        }
    });    
}
