const cronHit = require('node-cron');

module.exports = () => {  
    cronHit.schedule('*/5 * * * *', function() {
        const options = {
            method: 'GET',
            url: 'http://localhost:4000/bet/get-all-bets',
        };
        try{
            axios.request(options)
        }catch (err){
            console.log('err',err)
        }
    });    
}
