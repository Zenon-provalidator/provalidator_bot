const fetch = require('sync-fetch')
require('dotenv').config()


function getMessage(coin){
	let msg = `💫 Sifchain (ROWAN)\nㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ\n\n`
	switch(coin){
		case 'sifchain' :
			let price = getSifDexPrice().toFixed(4)
			let totalTokens = (getTokenTotal('rowan') / 1000000000000000000).toFixed(0)
			let stakedTokens = (getStaked() / 1000000000000000000).toFixed(0)
			let notStakedTokens = totalTokens - stakedTokens
			let stakedPercent = (stakedTokens / totalTokens * 100).toFixed(0)
			let notStakedPercent = (notStakedTokens / totalTokens * 100).toFixed(0)
			msg += `💰Price : $${price} (Sifchain’s DEX)\n\n`
			msg += `🥩Staked : ${numberWithCommas(stakedTokens)} (${stakedPercent}%)\n\n`
			msg += `🔓Unstaked : ${numberWithCommas(notStakedTokens)} (${notStakedPercent}%)\n\n`
			msg += `⛓️Total : ${numberWithCommas(totalTokens)} (100%)\n\n`
			msg += `ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ\n`
			msg += `Supported by <a href='https://provalidator.com'>Provalidator</a>\n`
//			msg += `<a href='https://provalidator.com'>Home</a> <a href='https://twitter.com/provalidator'>Twitter</a> <a href='https://medium.com/provalidator'>Medium</a>`
			break
	}
	
	return msg
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