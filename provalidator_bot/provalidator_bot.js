const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const session = require('telegraf/session')
const logger = require('./log4js').log4js//logger
const func = require('./func')
require('dotenv').config()
const bot = new Telegraf(process.env.BOT_TOKEN, {username: process.env.BOT_ID})

//session
bot.use(session())
////bot start
bot.startPolling()

bot.command('sifchain', (ctx) =>{
	//delete existing message
	if(typeof ctx.session.msg_id != 'undefined' && typeof ctx.session.chat_id != 'undefined'){
		bot.telegram.deleteMessage(ctx.session.chat_id, ctx.session.msg_id).catch(err=>{
			logger.error(err)
		})
	}
	//show message
	ctx.reply(`Please wait..`).then((m) => {
		let msg = func.getMessage('sifchain')//get message
		//session
		ctx.session.msg_id = m.message_id
		ctx.session.chat_id = m.chat.id
		//edit message
		bot.telegram.editMessageText(m.chat.id, m.message_id, m.message_id, msg, Extra.HTML()).catch(err=>{				
			logger.error(`=======================sifchain main1=======================`)
			logger.error(err)
			bot.telegram.editMessageText(m.chat.id, m.message_id, m.message_id, `Sorry! bot has error.`)
		})
	})
}).catch(err=>{
//	bot.telegram.sendMessage(m.chat.id, m.message_id, `Sorry! bot has error.`)
	logger.error(err)
})