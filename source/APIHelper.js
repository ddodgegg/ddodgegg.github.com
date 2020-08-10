const request = require('request');

const frontUrl = "https://kr.api.riotgames.com/lol/";

var time = 1.3;
var key = undefined;

function SetTime(delay){
    time = delay;
}

function Delay(time){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time * 1000);
    });
}

function Request(url){
    return new Promise((resolve, reject) => {
        request(url, async function(err, res, body){
            if(err){
                console.log('normal error', body, err);
                reject(err);
            }
            else{
                if(body == undefined){
                    console.log('network error', body, err);
                    reject(body);
                }
                else{
                    let result = JSON.parse(body);
                    await Delay(time);

                    if(result.status == undefined){
                        resolve(result);
                    }else{
                        console.log('api error', body, err);
                        reject(result.status.status_code);
                    }
                }
            }

            // let result;
            // try{
            //     result = JSON.parse(body);
                
            //     if(err || result.status != undefined){
            //         console.log('api error: ', err, result);
            //         reject(result); 
            //     }
            //     else{
            //         await Delay(time);
            //         resolve(result);
            //     }
            // }
            // catch(err){
            //     console.log('network error: ', err);
            //     reject(result);
            // }
        });
    });
}

async function Summoner(name){
    // try{
        let url = frontUrl + "summoner/v4/summoners/by-name/" + 
            encodeURI(name) + "?api_key=" + key;

        let result = await Request(url);

        return result;
    //     return result;
    // }
    // catch(err){
    //     throw err;
    // }
}

async function GetAllLeagueUsers(tier, division, queue = 'RANKED_SOLO_5x5'){
    console.log('----- start get all league users -----');

    // tier: IRON, BRONZE, SILVER, GOLD, PLATINUM, DIAMOND, MASTER, GRANDMASTER, CHALLANGER
    // division: I, II, III, IV
    // queue: RANKED_SOLO_5x5, RANKED_FLEX_SR, RANKED_FLEX_TT, RANKED_TFT
    
    let currentSummonerCount = 205;
    let summoners = new Array();
    let page = 1;
    while (currentSummonerCount >= 205 && page < 1000) {
        try{
            let users = await GetLeagueUsers(tier, division, page, queue);

            summoners = summoners.concat(users);
            currentSummonerCount = result.length;
            console.log('tier: ', tier, division, 'page: ', page, 'summoners: ', summoners.length);
            ++page;
        }
        catch(err){
            if(err != undefined && errorcodes.indexOf(err.status.status_code) == -1){
                console.log('매치를 찾지 못했습니다. ', err);
                ++page;
            }
        }
    }

    console.log('----- complete ', tier, division, 'summoners: ', summoners.length, '-----');

    return summoners;
}

async function GetLeagueUsers(tier, division, page, queue = 'RANKED_SOLO_5x5'){
    let url = frontUrl + "league-exp/v4/entries/" + 
        queue + "/" + tier + "/" + division +"?page=" + page + "&api_key=" + key;
    let result = await Request(url);

    return result;
}

async function GetMatchList(encryptID, beginTime, endTime, type = 420){
    let url = "https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/" + 
    encryptID + '?api_key=' + key + '&queue=' + type + 
    '&endTime=' + endTime + '&beginTime=' + beginTime;
    
    let result = await Request(url);
    
    return result;
}

async function GetMatch(matchID){
    let url = "https://kr.api.riotgames.com/lol/match/v4/matches/" + matchID + '?api_key=' + key;

    let result = await Request(url);
    
    return result;
}

module.exports = function (keyCode, interval){
    key = keyCode;
    time = interval;

    return {
        SetTime, SetTime, 
        CustomRequest: Request, 
        Summoner: Summoner, 
        GetLeagueUsers: GetLeagueUsers, 
        GetMatchList: GetMatchList, 
        GetMatch: GetMatch
    }
}