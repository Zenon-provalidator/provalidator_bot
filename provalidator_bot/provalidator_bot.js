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
//			ctx.reply(msg, Extra.HTML())
			bot.telegram.editMessageText(m.chat.id, m.message_id, m.message_id, msg, Extra.HTML())
		})
//		
////		editMessageText
//		bot.telegram.sendMessage(ctx.state.telegramId, 'Please wait..').then((m) => {
//		    bot.telegram.editMessageText(editChatId, m.message_id, m.message_id, encMsg)
//		})
		
	}catch(e){
		ctx.reply(`Sorry! bot has error.`)
		logger.error(e)
	}
})