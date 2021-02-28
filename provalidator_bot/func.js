const fetch = require('sync-fetch')
require('dotenv').config()
const logger = require('./log4js').log4js//logger
const fs = require('fs');

//let rawdata = fs.readFileSync('student.json');
//let student = JSON.parse(rawdata);
//fs.writeFileSync(file, data[, options])


function getMessage(coin){
	let msg = ``
	let price = ``
	let totalTokens = ``
	let stakedTokens = ``
	let notStakedTokens = ``
	let stakedPercent = ``
	let notStakedPercent = ``
	try {
		if(coin == 'sifchain'){
			msg = `💫 Sifchain (ROWAN)\nㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ\n\n`	//msg
			let file = `./json/${coin}.json`
			let rJson = JSON.parse(fs.readFileSync(file))
			
			var wdate = parseInt(rJson.wdate) + (60 * 1000)
			var cdate = parseInt(new Date().getTime())
			
			// new
			if( wdate <  cdate) {
//				console.log('new' + cdate)
				price = getSifDexPrice().toFixed(4)
				totalTokens = (getTokenTotal('rowan') / 1000000000000000000).toFixed(0)
				stakedTokens = (getStaked() / 1000000000000000000).toFixed(0)
				notStakedTokens = totalTokens - stakedTokens
				stakedPercent = (stakedTokens / totalTokens * 100).toFixed(0)
				notStakedPercent = (notStakedTokens / totalTokens * 100).toFixed(0)
				let wJson = {
					"price" : price,
					"totalTokens" : totalTokens,
					"stakedTokens" : stakedTokens,
					"notStakedTokens" : notStakedTokens,
					"stakedPercent" : stakedPercent,
					"notStakedPercent" : notStakedPercent,
					"wdate" : new Date().getTime()
				}
				fs.writeFileSync(file, JSON.stringify(wJson))
			}else { //old
//				console.log('old'+ cdate)
				price = rJson.price
				totalTokens = rJson.totalTokens
				stakedTokens = rJson.stakedTokens
				notStakedTokens = rJson.notStakedTokens
				stakedPercent = rJson.stakedPercent
				notStakedPercent = rJson.notStakedPercent
			}
		} // end if
		msg += `💰Price : $${price} (Sifchain’s DEX)\n\n`
		msg += `🥩Staked : ${numberWithCommas(stakedTokens)} (${stakedPercent}%)\n\n`
		msg += `🔓Unstaked : ${numberWithCommas(notStakedTokens)} (${notStakedPercent}%)\n\n`
		msg += `⛓️Total : ${numberWithCommas(totalTokens)} (100%)\n\n`
		msg += `ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ\n`
		msg += `Supported by <a href='https://provalidator.com'>Provalidator</a>\n`
		return msg
	}catch(err){
		logger.error(`=======================sifchain msg=======================`)
		logger.error(err)
		return null
	}
}

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}


function getStaked(){
	let json = fetch(process.env.SIF_API_URL+'/staking/pool').json()
	return json.result.bonded_tokens
}

function getTokenTotal(tokenDenom){
	let json = fetch(process.env.SIF_API_URL+'/supply/total').json()
	let jsonResult = json.result
	
	for(var i=0; i<jsonResult.length; i++){
		if(jsonResult[i].denom == tokenDenom){
			return jsonResult[i].amount
		}	
	}
}

function getSifDexPrice(tokenDenom){
	let json = fetch(process.env.SIF_DEX_API_URL).json()
	let jsonResult = json.body
	return json.body.rowanUSD
}

module.exports = {
	getMessage : getMessage
}