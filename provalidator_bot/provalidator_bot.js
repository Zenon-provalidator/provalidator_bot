const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const logger = require('./log4js').log4js//logger
const func = require('./func')
require('dotenv').config()
const bot = new Telegraf(process.env.BOT_TOKEN, {username: process.env.BOT_ID})
//
////bot start
bot.startPolling()
//
bot.command('sifchain', (ctx) =>{
	try{
		ctx.reply(`Please wait..`).then((m) => {
			let msg = func.getMessage('sifchain')
			bot.telegram.editMessageText(m.chat.id, m.message_id, m.message_id, msg, Extra.HTML()).catch(err=>{
				logger.error(`=======================sifchain main1=======================`)
				logger.error(err)
				bot.telegram.editMessageText(m.chat.id, m.message_id, m.message_id, `Sorry! bot has error.`)
			})
		})
		
	}catch(e){
		bot.telegram.editMessageText(m.chat.id, m.message_id, m.message_id, `Sorry! bot has error.`)
		logger.error(`=======================sifchain main2=======================`)
		logger.error(e)
	}
})