const fetch = require('sync-fetch')
require('dotenv').config()
const logger = require('./log4js').log4js//logger
const fs = require('fs')
const numeral = require('numeral')

//let rawdata = fs.readFileSync('student.json');
//let student = JSON.parse(rawdata);
//fs.writeFileSync(file, data[, options])


function getMessage(coin){
	let msg = ``
	let price = ``
	let maxTokens = ``
	let stakedTokens = ``
	let totalTokens = ``
	let stakedPercent = ``
	let totalPercent = ``
	let teamTokens = ``
	let communityTokens = ``
	let communityPercent = ``
		
	try {
		if(coin == 'sifchain'){
			msg = `💫 <b>Sifchain (ROWAN)</b>\nㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ\n\n`	//msg
			//no file = create
			let file = `./json/${coin}.json`
			let rJson = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : ''
			var wdate = fs.existsSync(file) ? parseInt(rJson.wdate) + (60 * 1000) : 0
			var cdate = parseInt(new Date().getTime())
			
			// new
			if( wdate <  cdate) {
//				console.log('new' + cdate)
//				console.log(getCommunityTokens())
				price = getSifDexPrice().toFixed(4)
				maxTokens = (getTokenTotal('rowan') / 1000000000000000000).toFixed(0)
				stakedTokens = (getStaked() / 1000000000000000000).toFixed(0)
				stakedPercent = (stakedTokens / maxTokens * 100).toFixed(0)
//				totalTokens = maxTokens - stakedTokens
//				totalPercent = (totalTokens / maxTokens * 100).toFixed(0)
				teamTokens = getTeamTokens()
				teamPercent = (teamTokens / maxTokens * 100).toFixed(0)
				communityTokens = stakedTokens - teamTokens
				communityPercent = (communityTokens / maxTokens * 100).toFixed(0)
				totalTokens = teamTokens + communityTokens
				totalPercent = (totalTokens / maxTokens * 100).toFixed(0)
				
				let wJson = {
					"price" : price,
					"maxTokens" : maxTokens,
					"stakedTokens" : stakedTokens,
					"totalTokens" : totalTokens,
					"stakedPercent" : stakedPercent,
					"totalPercent" : totalPercent,
					"teamTokens" : teamTokens,
					"teamPercent" : teamPercent,
					"communityTokens" : communityTokens,
					"communityPercent" : communityPercent,
					"wdate" : new Date().getTime()
				}
				fs.writeFileSync(file, JSON.stringify(wJson))
			}else { //old
//				console.log('old'+ cdate)
				price = rJson.price
				maxTokens = rJson.maxTokens
				stakedTokens = rJson.stakedTokens
				totalTokens = rJson.totalTokens
				stakedPercent = rJson.stakedPercent
				totalPercent = rJson.totalPercent
				teamTokens = rJson.teamTokens
				teamPercent = rJson.teamPercent
				communityTokens = rJson.communityTokens
				communityPercent = rJson.communityPercent
			}
		} // end if
		msg += `💰<b>Price</b>: $${price} (Sifchain’s DEX)\n\n`
		msg += `🥩<b>Staking</b>\n\n`
		msg += `✅Community: ${numberWithCommas(communityTokens)} (${communityPercent}%)\n\n`
//		msg += `**Team: ${numberWithCommas(teamTokens)} (${teamPercent}%)\n\n`
		msg += `✅Total: ${numberWithCommas(totalTokens)} (${totalPercent}%)\n\n`
		msg += `⛓️Max Sply: ${numberWithCommas(maxTokens)} (100%)\n\n`
		msg += `📌${numeral(teamTokens).format('0.0a').toUpperCase()} staked by Foundation will be removed soon and is not eligible for validator rewards.\n\n`
		msg += `ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ\n`
		msg += `Supported by <b>Provalidator</b>\n`
		//<a href='https://provalidator.com'>
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

function getTeamTokens(){
	let json = fetch(process.env.SIF_API_URL+'/staking/validators').json()

	let team_tokens = 0

	for(var j in json.result){ 
		let operator_address =json.result[j].operator_address
		let moniker = json.result[j].description.moniker
		let team_validators = ['alice', 'jenna','lisa', 'mary', 'sophie', 'ambre', 'elizabeth', 'jane']

	   // target
		if(team_validators .indexOf(moniker) >=0) {
			let tokens = json.result[j].tokens / 1000000000000000000
	//	      console.log(operator_address)
	//	      console.log(moniker)
	//	      console.log(tokens)
			team_tokens += parseInt(tokens) 
		}
	}
	//team_tokens = team_tokens.toLocaleString()
	//console.log(team_tokens)
	return team_tokens
}

module.exports = {
	getMessage : getMessage
}