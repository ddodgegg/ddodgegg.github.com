function GetWinTeam(match) {
    let start = match.teams[0].win == 'Win' ? 0 : 5;
    let result = {};
    for(let i = 0; i < 5; ++i){
        if(match.participants[start + i].timeline.lane == 'NONE'){
            // console.log(match.participantIdentities[start + i].player.summonerName, '유저는 포지션을 알 수 없습니다.', match.participants[start + i].timeline.lane, match.participants[start + i].timeline.role, start + i);
        }
        else{
            if(match.participants[start + i].timeline.lane == 'BOTTOM'){
                if(match.participants[start + i].timeline.role != 'DUO_CARRY' && match.participants[start + i].timeline.role != 'DUO_SUPPORT'){
                    // console.log(match.participantIdentities[start + i].player.summonerName, '유저는 바텀 포지션을 알 수 없습니다.', match.participants[start + i].timeline.lane, match.participants[start + i].timeline.role, start + i);
                }
                else{
                    // console.log(match.participantIdentities[start + i].player.summonerName, '유저는', match.participants[start + i].timeline.role, '포지션입니다.', start + i);
                    result[match.participants[start + i].timeline.role] = {
                        name: match.participantIdentities[start + i].player.summonerName,
                        championId: match.participants[start + i].championId
                    };
                }
            }
            else{
                // console.log(match.participantIdentities[start + i].player.summonerName, '유저는', match.participants[start + i].timeline.lane, '포지션입니다.', start + i);
                result[match.participants[start + i].timeline.lane] = {
                    name: match.participantIdentities[start + i].player.summonerName,
                    championId: match.participants[start + i].championId
                };
            }
        }
    }

    return result;
}

function GetLossTeam(match) {
    let start = match.teams[0].win == 'Fail' ? 0 : 5;
    let result = {};
    for(let i = 0; i < 5; ++i){
        if(match.participants[start + i].timeline.lane == 'NONE'){
            // console.log(match.participantIdentities[start + i].player.summonerName, '유저는 포지션을 알 수 없습니다.', match.participants[start + i].timeline.lane, match.participants[start + i].timeline.role, start + i);
        }
        else{
            if(match.participants[start + i].timeline.lane == 'BOTTOM'){
                if(match.participants[start + i].timeline.role != 'DUO_CARRY' && match.participants[start + i].timeline.role != 'DUO_SUPPORT'){
                    // console.log(match.participantIdentities[start + i].player.summonerName, '유저는 바텀 포지션을 알 수 없습니다.', match.participants[start + i].timeline.lane, match.participants[start + i].timeline.role, start + i);
                }
                else{
                    // console.log(match.participantIdentities[start + i].player.summonerName, '유저는', match.participants[start + i].timeline.role, '포지션입니다.', start + i);
                    result[match.participants[start + i].timeline.role] = {
                        name: match.participantIdentities[start + i].player.summonerName,
                        championId: match.participants[start + i].championId
                    };
                }
            }
            else{
                // console.log(match.participantIdentities[start + i].player.summonerName, '유저는', match.participants[start + i].timeline.lane, '포지션입니다.', start + i);
                result[match.participants[start + i].timeline.lane] = {
                    name: match.participantIdentities[start + i].player.summonerName,
                    championId: match.participants[start + i].championId
                };
            }
        }
    }

    return result;
}

function MakeBans(match){
    let result = [];

    match.teams[0].bans.forEach(element => {
        result.push(element.championId);
    });
    match.teams[1].bans.forEach(element => {
        result.push(element.championId);
    });

    return result;
}

function MakeMatch(matches) {
    let result = [];

    matches.forEach(element => {
        let gameId = Number(element.gameId);
        console.log(element);
        let bans = element.bans.split('/').map(x=>+x);

        let MakeUser = function(player) {
            if(player == 'NONE'){
                return undefined;
            }

            let tempPlayer = player.split('/');
            let tempObj = {
                name: tempPlayer[0], 
                championId: Number(tempPlayer[1])
            };

            return tempObj;
        }

        let winTeam = [
            MakeUser(element.winPlayer1), 
            MakeUser(element.winPlayer2), 
            MakeUser(element.winPlayer3), 
            MakeUser(element.winPlayer4), 
            MakeUser(element.winPlayer5), 
        ];

        let lossTeam = [
            MakeUser(element.lossPlayer1), 
            MakeUser(element.lossPlayer2), 
            MakeUser(element.lossPlayer3), 
            MakeUser(element.lossPlayer4), 
            MakeUser(element.lossPlayer5), 
        ];

        let tempMatch = {
            gameId: gameId, 
            bans: bans, 
            winTeam: winTeam, 
            lossTeam: lossTeam
        };

        result.push(tempMatch);
    });

    return result;
}

function MakeWinPlayer(position, winPlayer, lossPlayer) {
    let winResult1 = {win: 1, total: 1};
    let winResult2 = {};
    winResult2[lossPlayer.championId] = winResult1;
    let winResult3 = {};
    winResult3[winPlayer.championId] = winResult2;
    let winResult4 = {};
    winResult4[position] = winResult3;
    let winResult5 = {};
    winResult5[winPlayer.name] = winResult4;

    return winResult5;
}

function MakeLossPlayer(position, winPlayer, lossPlayer) {
    let lossResult1 = {win: 0, total: 1};
    let lossResult2 = {};
    lossResult2[winPlayer.championId] = lossResult1;
    let lossResult3 = {};
    lossResult3[lossPlayer.championId] = lossResult2;
    let lossResult4 = {};
    lossResult4[position] = lossResult3;
    let lossResult5 = {};
    lossResult5[lossPlayer.name] = lossResult4;

    return lossResult5;
}

function GetBans(matches){
    let result = {};

    matches.forEach(function(match){
        console.log(match.bans, Array.from(new Set(match.bans)));
        Array.from(new Set(match.bans)).forEach(function(banChamp){
            if(banChamp in result){
                result[banChamp] += 1;
            }
            else{
                result[banChamp] = 1;
            }
        });
    });

    return result;
}

function GetPlayers(matches){
    let summoners = {};

    matches.forEach(function(element){
        let position = ['TOP', 'JUNGLE', 'MIDDLE', 'DUO_CARRY', 'DUO_SUPPORT'];
        
        let winTeam = element.winTeam;
        let lossTeam = element.lossTeam;
        for(let j = 0; j < position.length; ++j){
            if(winTeam[j] == undefined || lossTeam[j] == undefined){
                console.log(position[j], '포지션이 검색되지 않습니다.');
                continue;
            }

            if(winTeam[j].name in summoners){
                if(position[j] in summoners[winTeam[j].name]){
                    if(winTeam[j].championId in summoners[winTeam[j].name][position[j]]){
                        if(lossTeam[j].championId in summoners[winTeam[j].name][position[j]][winTeam[j].championId]){
                            summoners[winTeam[j].name][position[j]][winTeam[j].championId][lossTeam[j].championId]['win'] += 1;
                            summoners[winTeam[j].name][position[j]][winTeam[j].championId][lossTeam[j].championId]['total'] += 1;
                        }
                        else{
                            summoners[winTeam[j].name][position[j]][winTeam[j].championId][lossTeam[j].championId] = {win: 1, total: 1};
                        }
                    }
                    else{
                        let tempObj = {win: 1, total: 1};
                        let tempObj2 = {};
                        tempObj2[lossTeam[j].championId] = tempObj;
                        summoners[winTeam[j].name][position[j]][winTeam[j].championId] = tempObj2;
                    }
                }
                else{
                    let tempObj = {win: 1, total: 1};
                    let tempObj2 = {};
                    tempObj2[lossTeam[j].championId] = tempObj;
                    let tempObj3 = {};
                    tempObj3[winTeam[j].championId] = tempObj2;
                    summoners[winTeam[j].name][position[j]] = tempObj3;
                }
            }
            else{
                let tempObj = {win: 1, total: 1};
                let tempObj2 = {};
                tempObj2[lossTeam[j].championId] = tempObj;
                let tempObj3 = {};
                tempObj3[winTeam[j].championId] = tempObj2;
                let tempObj4 = {};
                tempObj4[position[j]] = tempObj3;
                summoners[winTeam[j].name] = tempObj4;
            }

            if(lossTeam[j].name in summoners){
                if(position[j] in summoners[lossTeam[j].name]){
                    if(lossTeam[j].championId in summoners[lossTeam[j].name][position[j]]){
                        if(winTeam[j].championId in summoners[lossTeam[j].name][position[j]][lossTeam[j].championId]){
                            summoners[lossTeam[j].name][position[j]][lossTeam[j].championId][winTeam[j].championId]['total'] += 1;
                        }
                        else{
                            summoners[lossTeam[j].name][position[j]][lossTeam[j].championId][winTeam[j].championId] = {win: 0, total: 1};
                        }
                    }
                    else{
                        let tempObj = {win: 0, total: 1};
                        let tempObj2 = {};
                        tempObj2[winTeam[j].championId] = tempObj;
                        summoners[lossTeam[j].name][position[j]][lossTeam[j].championId] = tempObj2;
                    }
                }
                else{
                    let tempObj = {win: 0, total: 1};
                    let tempObj2 = {};
                    tempObj2[winTeam[j].championId] = tempObj;
                    let tempObj3 = {};
                    tempObj3[lossTeam[j].championId] = tempObj2;
                    summoners[lossTeam[j].name][position[j]] = tempObj3;
                }
            }
            else{
                let tempObj = {win: 0, total: 1};
                let tempObj2 = {};
                tempObj2[winTeam[j].championId] = tempObj;
                let tempObj3 = {};
                tempObj3[lossTeam[j].championId] = tempObj2;
                let tempObj4 = {};
                tempObj4[position[j]] = tempObj3;
                summoners[lossTeam[j].name] = tempObj4;
            }
        }
    });

    return summoners;
}

module.exports = {
    GetWinTeam: GetWinTeam, 
    GetLossTeam: GetLossTeam, 
    MakeMatch: MakeMatch, 
    MakeBans: MakeBans, 
    MakeWinPlayer: MakeWinPlayer, 
    MakeLossPlayer: MakeLossPlayer, 
    GetBans: GetBans, 
    GetPlayers: GetPlayers, 
}