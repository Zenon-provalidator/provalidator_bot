const fetch = require('sync-fetch')
require('dotenv').config()
const logger = require('./log4js').log4js//logger
const fs = require('fs')
const numeral = require('numeral')

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
		//no file = create
		let file = `./json/${coin}.json`
		let rJson = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : ''
		var wdate = fs.existsSync(file) ? parseInt(rJson.wdate) + (60 * 1000) : 0
		var cdate = parseInt(new Date().getTime())
		
		if(coin == 'sifchain'){
			msg = `💫 <b>Sifchain (ROWAN)</b>\nㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ\n\n`	//msg
			
			// new
			if( wdate <  cdate) {
				price = getSifDexPrice().toFixed(4)
				maxTokens = (getTokenTotal(coin) / 1000000000000000000).toFixed(0)
				stakedTokens = (getStaked(coin) / 1000000000000000000).toFixed(0)
				stakedPercent = (stakedTokens / maxTokens * 100).toFixed(0)
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
			msg += `💰<b>Price</b>: $${price} (Sifchain’s DEX)\n\n`
			msg += `🥩<b>Staking</b>\n\n`
			msg += `✅Community: ${numberWithCommas(communityTokens)} (${communityPercent}%)\n\n`
			msg += `✅Total: ${numberWithCommas(totalTokens)} (${totalPercent}%)\n\n`
			msg += `⛓️Max Sply: ${numberWithCommas(maxTokens)} (100%)\n\n`
			msg += `📌${numeral(teamTokens).format('0.0a').toUpperCase()} staked by Foundation will be removed soon and is not eligible for validator rewards.\n\n`
			msg += `ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ\n`
			msg += `Supported by <b>Provalidator</b>\n`
		} // end sifchain
		

		return msg
	}catch(err){
		logger.error(`=======================func error=======================`)
		logger.error(err)
		return null
	}
}

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}


function getStaked(coin){
	let url = ''
	if(coin == 'sifchain'){
		url = process.env.SIF_API_URL+'/staking/pool'
	}else if(coin == 'agoric'){		
		url = process.env.AG_API_URL+'/staking/pool'
	}
	
	let json = fetch(url).json()
	return json.result.bonded_tokens
}

function getTokenTotal(coin){
	let url = ''
	let tokenDenom = ''
	
	if(coin == 'sifchain'){
		tokenDenom = 'rowan'
		url = process.env.SIF_API_URL+'/supply/total'
	} else if(coin == 'agoric'){		
		tokenDenom = 'uagstake'
		url = process.env.AG_API_URL+'/bank/total'
	}
	
	let json = fetch(url).json()
	let jsonResult = json.result
	
	for(var i=0; i<jsonResult.length; i++){
		if(jsonResult[i].denom == tokenDenom){
			return jsonResult[i].amount
		}	
	}
}

function getCosmosInfo(){
	let json = fetch(process.env.COSMOS_API_URL).json()
	let returnArr = { 
		'bonded_tokens' : json.bonded_tokens,
		'not_bonded_tokens' : json.not_bonded_tokens,
		'max_tokens' :''
	}
	
	for(var j in json.total_circulating_tokens.supply){
		if(json.total_circulating_tokens.supply[j].denom == 'uatom'){
			returnArr.max_tokens = json.total_circulating_tokens.supply[j].amount
			break
		}
	}
	return returnArr	
}

function getSifDexPrice(tokenDenom){
	try{
		let json = fetch(process.env.SIF_DEX_API_URL).json()
		return json.body.rowanUSD
	} catch(err){
		console.error(err)
		let json = fetch('https://api.coingecko.com/api/v3/simple/price?ids=sifchain&vs_currencies=usd').json()
		return json.sifchain.usd
	}	
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
			team_tokens += parseInt(tokens) 
		}
	}
	return team_tokens
}

module.exports = {
	getMessage : getMessage
}