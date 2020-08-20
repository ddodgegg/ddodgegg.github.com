// function GetTeam(match){
//     let winCode = match.teams[0].win == 'Win' ? 100 : 200;
//     let lossCode = winCode == 100 ? 200 : 100;

//     let start = winCode == 100 ? 0 : 5;
//     let result = {};
//     for(let i = 0; i < 5; ++i){
//         if(match.participants[start + i].timeline.lane == 'NONE'){
//             console.log(match.participantIdentities[start + i].player.summonerName, '유저는 포지션을 알 수 없습니다.', match.participants[start + i].timeline.lane, match.participants[start + i].timeline.role, start + i);
//         }
//         else{
//             if(match.participants[start + i].timeline.lane == 'BOTTOM'){
//                 if(match.participants[start + i].timeline.role != 'DUO_CARRY' && match.participants[start + i].timeline.role != 'DUO_SUPPORT'){
//                     console.log(match.participantIdentities[start + i].player.summonerName, '유저는 바텀 포지션을 알 수 없습니다.', match.participants[start + i].timeline.lane, match.participants[start + i].timeline.role, start + i);
//                 }
//                 else{
//                     console.log(match.participantIdentities[start + i].player.summonerName, '유저는', match.participants[start + i].timeline.role, '포지션입니다.', start + i);
//                     result[match.participants[start + i].timeline.role] = {
//                         name: match.participantIdentities[start + i].player.summonerName,
//                         championId: match.participants[start + i].championId
//                     };
//                 }
//             }
//             else{
//                 console.log(match.participantIdentities[start + i].player.summonerName, '유저는', match.participants[start + i].timeline.lane, '포지션입니다.', start + i);
//                 result[match.participants[start + i].timeline.lane] = {
//                     name: match.participantIdentities[start + i].player.summonerName,
//                     championId: match.participants[start + i].championId
//                 };
//             }
//         }
//     }

//     return result;
// }

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
        // if(element.championId in result){
        //     result[element.championId] += 1;
        // }
        // else{
        //     result[element.championId] = 1;
        // }
        result.push(element.championId);
    });
    match.teams[1].bans.forEach(element => {
        // if(element.championId in result){
        //     result[element.championId] += 1;
        // }
        // else{
        //     result[element.championId] = 1;
        // }
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
    // let tempName = winPlayer.name;
    // let tempPosition = position
    // let tempWinChampion = winPlayer.championId;
    // let tempLossChampion = lossPlayer.championId;
    // let win_result2 = {
    //     tempName: {
    //         tempPosition: {
    //             tempWinChampion: {
    //                 tempLossChampion: {
    //                     win: 1, 
    //                     total: 1
    //                 }
    //             }
    //         }
    //     }
    // }
    // let win_result = {};
    // win_result[winPlayer.name][position][winPlayer.championId][lossPlayer.championId] = {
    //     win: 1, 
    //     total: 1
    // }
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

    console.log(matches);

    matches.forEach(function(match){
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
    // GetTeam: GetTeam, 
    GetWinTeam: GetWinTeam, 
    GetLossTeam: GetLossTeam, 
    MakeMatch: MakeMatch, 
    MakeBans: MakeBans, 
    MakeWinPlayer: MakeWinPlayer, 
    MakeLossPlayer: MakeLossPlayer, 
    GetBans: GetBans, 
    GetPlayers: GetPlayers, 
    
}

// function InsertSummoners(summoners, winTeam, lossTeam){
//     let position = ['TOP', 'JUNGLE', 'MIDDLE', 'DUO_CARRY', 'DUO_SUPPORT'];

//     for(let j = 0; j < 5; ++j){
//         console.log('-----', position[j], '검출 시작-----')
//         console.log(winTeam[position[j]]);
//         console.log(lossTeam[position[j]]);

//         if(position[j] in winTeam == false){
//             console.log('승리팀에는', position[j], '포지션이 검색되지 않습니다.');
//             continue;
//         }
//         if(position[j] in lossTeam == false){
//             console.log('패배팀에는', position[j], '포지션이 검색되지 않습니다.');
//             continue;
//         }

//         if(winTeam[position[j]].name in summoners){
//             if(position[j] in summoners[winTeam[position[j]].name]){
//                 if(winTeam[position[j]].championId in summoners[winTeam[position[j]].name][position[j]]){
//                     if(lossTeam[position[j]].championId in summoners[winTeam[position[j]].name][position[j]][winTeam[position[j]].championId]){
//                         summoners[winTeam[position[j]].name][position[j]][winTeam[position[j]].championId][lossTeam[position[j]].championId]['win'] += 1;
//                         summoners[winTeam[position[j]].name][position[j]][winTeam[position[j]].championId][lossTeam[position[j]].championId]['total'] += 1;
//                     }
//                     else{
//                         summoners[winTeam[position[j]].name][position[j]][winTeam[position[j]].championId][lossTeam[position[j]].championId] = {win: 1, total: 1};
//                     }
//                 }
//                 else{
//                     let tempObj = {win: 1, total: 1};
//                     let tempObj2 = {};
//                     tempObj2[lossTeam[position[j]].championId] = tempObj;
//                     summoners[winTeam[position[j]].name][position[j]][winTeam[position[j]].championId] = tempObj2;
//                 }
//             }
//             else{
//                 let tempObj = {win: 1, total: 1};
//                 let tempObj2 = {};
//                 tempObj2[lossTeam[position[j]].championId] = tempObj;
//                 let tempObj3 = {};
//                 tempObj3[winTeam[position[j]].championId] = tempObj2;
//                 summoners[winTeam[position[j]].name][position[j]] = tempObj3;
//             }
//         }
//         else{
//             let tempObj = {win: 1, total: 1};
//             let tempObj2 = {};
//             tempObj2[lossTeam[position[j]].championId] = tempObj;
//             let tempObj3 = {};
//             tempObj3[winTeam[position[j]].championId] = tempObj2;
//             let tempObj4 = {};
//             tempObj4[position[j]] = tempObj3;
//             summoners[winTeam[position[j]].name] = tempObj4;
//         }

//         if(lossTeam[position[j]].name in summoners){
//             if(position[j] in summoners[lossTeam[position[j]].name]){
//                 if(lossTeam[position[j]].championId in summoners[lossTeam[position[j]].name][position[j]]){
//                     if(winTeam[position[j]].championId in summoners[lossTeam[position[j]].name][position[j]][lossTeam[position[j]].championId]){
//                         summoners[lossTeam[position[j]].name][position[j]][lossTeam[position[j]].championId][winTeam[position[j]].championId]['total'] += 1;
//                     }
//                     else{
//                         summoners[lossTeam[position[j]].name][position[j]][lossTeam[position[j]].championId][winTeam[position[j]].championId] = {win: 0, total: 1};
//                     }
//                 }
//                 else{
//                     let tempObj = {win: 0, total: 1};
//                     let tempObj2 = {};
//                     tempObj2[winTeam[position[j]].championId] = tempObj;
//                     summoners[lossTeam[position[j]].name][position[j]][lossTeam[position[j]].championId] = tempObj2;
//                 }
//             }
//             else{
//                 let tempObj = {win: 0, total: 1};
//                 let tempObj2 = {};
//                 tempObj2[winTeam[position[j]].championId] = tempObj;
//                 let tempObj3 = {};
//                 tempObj3[lossTeam[position[j]].championId] = tempObj2;
//                 summoners[lossTeam[position[j]].name][position[j]] = tempObj3;
//             }
//         }
//         else{
//             let tempObj = {win: 0, total: 1};
//             let tempObj2 = {};
//             tempObj2[winTeam[position[j]].championId] = tempObj;
//             let tempObj3 = {};
//             tempObj3[lossTeam[position[j]].championId] = tempObj2;
//             let tempObj4 = {};
//             tempObj4[position[j]] = tempObj3;
//             summoners[lossTeam[position[j]].name] = tempObj4;
//         }

//         console.log('-----', position[j],'검출 완료 -----');
//         // console.log(JSON.stringify(summoners));
//     }

//     ++i;
//     ++matchCount;
//     }
//     catch(err){
//     console.log('매치 정보 요청 도중 에러가 발생했습니다.\n', err);
//     if(err != undefined && errorcodes.indexOf(err.status.status_code) == -1){
//         ++i;
//     }
//     }
//     }
// }