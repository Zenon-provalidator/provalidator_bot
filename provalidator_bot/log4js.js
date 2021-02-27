const log4js = require('log4js')

//logger
log4js.configure({
    appenders: { 
    	provalidator_sif_bot: { 
			type: 'dateFile', 
			filename: './provalidator_sif_bot.log',
		    compress: true
    	} 
    },
    categories: { 
    	default: { 
    		appenders: ['provalidator_sif_bot'], 
    		level: 'debug' 
    	} 
    }
})

const logger = log4js.getLogger('provalidator_sif_bot')

// console.log(logger)
module.exports = {
   log4js : logger
}