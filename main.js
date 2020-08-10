// async function ReplaceMatches(prevDate, nextDate){
//     console.log('----- start replace matches ------');
//     // get summoners
//     console.log('----- get all summoners from DB -----');
//     let encryptIDs;
//     try{
//         encryptIDs = await GetAllEncryptIDFromDB();
//     }
//     catch(err){
//         throw err;
//     }
//     // let encryptIDs = [
//     //     {accountId: 'BKczf496eQkpz2SNPrhfsc63CBRkZTKjpcpoTp-Liz73'}, 
//     //     {accountId: 'giVwy-3tasMuCghPFe5LiSlelffYfUB7DfU1iqqd41wkdVU'}
//     // ];

//     console.log('----- complete get all summoners -----', encryptIDs.length);

//     // get all matches
//     console.log('----- start get all matchIDs -----');
//     let matches = new Array();
//     for(let i = 0; i < encryptIDs.length;){
//         console.log('-----', encryptIDs[i].accountId, '-----', i, '/', encryptIDs.length);
//         try{
//             let tempMatches = await GetMatchList(encryptIDs[i].accountId, prevDate, nextDate);

//             for(let j = 0; j < tempMatches.matches.length; ++j){
//                 if(matches.indexOf(tempMatches.matches[j].gameId == -1)){
//                     matches.push(tempMatches.matches[j].gameId);
//                 }
//                 else{
//                     console.log('중복입니다.', tempMatches.matches[j].gameId);
//                 }
//             }

//             ++i;

//             console.log('current Matches: ', tempMatches.matches.length);
//         }
//         catch(err){
//             console.log('매치 리스트 요청 도중 에러가 발생했습니다.\n', err);            
//             if(err != undefined && errorcodes.indexOf(err.status.status_code) == -1){
//                 ++i;
//             }
//         }
//     }

//     console.log(matches);
//     console.log('----- complete get matcheIDs -----', matches.length);

//     // select user and champion count
//     let bans = {};
//     let summoners = {};
//     let matchCount = 0;
//     for(let i = 0; i < matches.length;){
//         console.log('match: ', matches[i], i, '/', matches.length);
//         if(matches[i] == undefined){
//             continue;
//         }
//         try{
//             let tempMatch = await GetMatch(matches[i]);

//             // get bans
//             tempMatch.teams[0].bans.forEach(element => {
//                 if(element.championId in bans){
//                     bans[element.championId] += 1;
//                 }
//                 else{
//                     bans[element.championId] = 1;
//                 }
//             });
//             tempMatch.teams[1].bans.forEach(element => {
//                 if(element.championId in bans){
//                     bans[element.championId] += 1;
//                 }
//                 else{
//                     bans[element.championId] = 1;
//                 }
//             });

//             // console.log(bans);

//             let wonTeam = {};
//             let lossTeam = {};

//             if(tempMatch.teams[0].win == 'Win'){
//                 wonTeam = GetTeam(tempMatch, 0);
//                 lossTeam = GetTeam(tempMatch, 5);
//             }
//             else{
//                 lossTeam = GetTeam(tempMatch, 0);
//                 wonTeam = GetTeam(tempMatch, 5);
//             }
            
//             console.log('----- win -----');
//             console.log(wonTeam);
//             console.log('----- loss -----');
//             console.log(lossTeam);

//             let position = ['TOP', 'JUNGLE', 'MIDDLE', 'DUO_CARRY', 'DUO_SUPPORT'];

//             for(let j = 0; j < 5; ++j){
//                 console.log('-----', position[j], '검출 시작-----')
//                 console.log(wonTeam[position[j]]);
//                 console.log(lossTeam[position[j]]);

//                 if(position[j] in wonTeam == false){
//                     console.log('승리팀에는', position[j], '포지션이 검색되지 않습니다.');
//                     continue;
//                 }
//                 if(position[j] in lossTeam == false){
//                     console.log('패배팀에는', position[j], '포지션이 검색되지 않습니다.');
//                     continue;
//                 }

//                 if(wonTeam[position[j]].name in summoners){
//                     if(position[j] in summoners[wonTeam[position[j]].name]){
//                         if(wonTeam[position[j]].championId in summoners[wonTeam[position[j]].name][position[j]]){
//                             if(lossTeam[position[j]].championId in summoners[wonTeam[position[j]].name][position[j]][wonTeam[position[j]].championId]){
//                                 summoners[wonTeam[position[j]].name][position[j]][wonTeam[position[j]].championId][lossTeam[position[j]].championId]['win'] += 1;
//                                 summoners[wonTeam[position[j]].name][position[j]][wonTeam[position[j]].championId][lossTeam[position[j]].championId]['total'] += 1;
//                             }
//                             else{
//                                 summoners[wonTeam[position[j]].name][position[j]][wonTeam[position[j]].championId][lossTeam[position[j]].championId] = {win: 1, total: 1};
//                             }
//                         }
//                         else{
//                             let tempObj = {win: 1, total: 1};
//                             let tempObj2 = {};
//                             tempObj2[lossTeam[position[j]].championId] = tempObj;
//                             summoners[wonTeam[position[j]].name][position[j]][wonTeam[position[j]].championId] = tempObj2;
//                         }
//                     }
//                     else{
//                         let tempObj = {win: 1, total: 1};
//                         let tempObj2 = {};
//                         tempObj2[lossTeam[position[j]].championId] = tempObj;
//                         let tempObj3 = {};
//                         tempObj3[wonTeam[position[j]].championId] = tempObj2;
//                         summoners[wonTeam[position[j]].name][position[j]] = tempObj3;
//                     }
//                 }
//                 else{
//                     let tempObj = {win: 1, total: 1};
//                     let tempObj2 = {};
//                     tempObj2[lossTeam[position[j]].championId] = tempObj;
//                     let tempObj3 = {};
//                     tempObj3[wonTeam[position[j]].championId] = tempObj2;
//                     let tempObj4 = {};
//                     tempObj4[position[j]] = tempObj3;
//                     summoners[wonTeam[position[j]].name] = tempObj4;
//                 }

//                 if(lossTeam[position[j]].name in summoners){
//                     if(position[j] in summoners[lossTeam[position[j]].name]){
//                         if(lossTeam[position[j]].championId in summoners[lossTeam[position[j]].name][position[j]]){
//                             if(wonTeam[position[j]].championId in summoners[lossTeam[position[j]].name][position[j]][lossTeam[position[j]].championId]){
//                                 summoners[lossTeam[position[j]].name][position[j]][lossTeam[position[j]].championId][wonTeam[position[j]].championId]['total'] += 1;
//                             }
//                             else{
//                                 summoners[lossTeam[position[j]].name][position[j]][lossTeam[position[j]].championId][wonTeam[position[j]].championId] = {win: 0, total: 1};
//                             }
//                         }
//                         else{
//                             let tempObj = {win: 0, total: 1};
//                             let tempObj2 = {};
//                             tempObj2[wonTeam[position[j]].championId] = tempObj;
//                             summoners[lossTeam[position[j]].name][position[j]][lossTeam[position[j]].championId] = tempObj2;
//                         }
//                     }
//                     else{
//                         let tempObj = {win: 0, total: 1};
//                         let tempObj2 = {};
//                         tempObj2[wonTeam[position[j]].championId] = tempObj;
//                         let tempObj3 = {};
//                         tempObj3[lossTeam[position[j]].championId] = tempObj2;
//                         summoners[lossTeam[position[j]].name][position[j]] = tempObj3;
//                     }
//                 }
//                 else{
//                     let tempObj = {win: 0, total: 1};
//                     let tempObj2 = {};
//                     tempObj2[wonTeam[position[j]].championId] = tempObj;
//                     let tempObj3 = {};
//                     tempObj3[lossTeam[position[j]].championId] = tempObj2;
//                     let tempObj4 = {};
//                     tempObj4[position[j]] = tempObj3;
//                     summoners[lossTeam[position[j]].name] = tempObj4;
//                 }

//                 console.log('-----', position[j],'검출 완료 -----');
//                 // console.log(JSON.stringify(summoners));
//             }

//             ++i;
//             ++matchCount;
//         }
//         catch(err){
//             console.log('매치 정보 요청 도중 에러가 발생했습니다.\n', err);
//             if(err != undefined && errorcodes.indexOf(err.status.status_code) == -1){
//                 ++i;
//             }
//         }
//     }

//     // console.log(JSON.stringify(summoners, null, '\t'));
//     console.log('----- complete analisis matches -----');

//     console.log('----- start load excel -----');
//     let xlsx = excel.readFile('./10.13_.xlsm');

//     let championBanMatchSheet = xlsx.Sheets["밴 횟수  매치업 승수 픽수"];
//     console.log(excel.utils.decode_range(championBanMatchSheet['!ref']));
//     let sheetRowCount = excel.utils.decode_range(championBanMatchSheet['!ref']).e.r;
//     for(let key in bans){
//         console.log(key, '챔피언의 벤 횟수를 삽입합니다. count: ', bans[key]);
//         if(key == -1){
//             console.log(key, '값은 벤 없음입니다. 건너뜁니다.');
//             continue;
//         }

//         for(let i = 0; i < sheetRowCount; ++i){
//             if(championBanMatchSheet['A' + (i + 2)] == undefined){
//                 throw '모든 챔피언을 검사했으나 해당 챔피언은 벤 리스트에 없습니다.';
//             }

//             if(key == championBanMatchSheet['A' + (i + 2)].v){
//                 championBanMatchSheet['B' + (i + 2)] = {v: bans[key], t: 'n'};
//                 break;
//             }
//         }
//     }

//     let sheetColumnCount = excel.utils.decode_range(championBanMatchSheet['!ref']).e.c;
//     let championSheetPosition = [];
//     let won_ChampionSheetPosition = [];
//     for(let i = 0; i < normal_ChampionSheet_Keyword.length; ++i){
//         for(let j = 0; j < sheetColumnCount; ++j){
//             let column = excel.utils.encode_col(j) + '1';
//             if(championBanMatchSheet[column] != undefined && championBanMatchSheet[column].v == normal_ChampionSheet_Keyword[i]){
//                 championSheetPosition.push(j);
//             }

//             if(championBanMatchSheet[column] != undefined && championBanMatchSheet[column].v == won_ChampionSheet_Keyword[i]){
//                 won_ChampionSheetPosition.push(j);
//                 break;
//             }
//         }

//         if(championSheetPosition[i] == undefined || won_ChampionSheetPosition[i] == undefined){
//             throw '챔피언 벤/픽순 시트 분석도중 포지션 행열을 가져올 수 없습니다.';
//         }
//         console.log(normal_ChampionSheet_Keyword[i], '의 열 번호는', championSheetPosition[i], excel.utils.encode_col(championSheetPosition[i]), '입니다.');
//         console.log(won_ChampionSheet_Keyword[i], '의 열 번호는', won_ChampionSheetPosition[i], excel.utils.encode_col(won_ChampionSheetPosition[i]), '입니다.');
//     }

//     let lol_position = ['TOP', 'JUNGLE', 'MIDDLE', 'DUO_CARRY', 'DUO_SUPPORT'];

//     // insert excel __ each champion total/win
//     let sheet_ChampionList = xlsx.Sheets["DR 10.13"];
//     let championlistCount = excel.utils.decode_range(sheet_ChampionList['!ref']).e.r;
//     let championList = new Array();
//     for(let i = 0; i < championlistCount; ++i){
//         championList.push(sheet_ChampionList['A' + (i + 1)].v);
//     }

//     // row
//     for(let i = 0; i < championList.length; ++i){
//         // column
//         for(let k = 0; k < championList.length; ++k){
//             // position
//             for(let j = 0; j < lol_position.length; ++j){
//                 let totalCount = 0;
//                 let winCount = 0;
//                 //find all users
//                 for(let key in summoners){
//                     if(lol_position[j] in summoners[key]){
//                         if(championList[i] in summoners[key][lol_position[j]]){
//                             if(championList[k] in summoners[key][lol_position[j]][championList[i]]){
//                                 totalCount += summoners[key][lol_position[j]][championList[i]][championList[k]].total;
//                                 winCount += summoners[key][lol_position[j]][championList[i]][championList[k]].win;
//                             }
//                         }
//                     }
//                 }

//                 if(totalCount != 0){
//                     console.log(lol_position[j], '---', championList[i], 'vs', championList[k], 'win/total: ', winCount, totalCount);
//                     console.log((excel.utils.encode_col(championSheetPosition[j] + (k + 1))) + (i + 2));
//                     console.log((excel.utils.encode_col(won_ChampionSheetPosition[j] + (k + 1))) + (i + 2));

//                     championBanMatchSheet[(excel.utils.encode_col(championSheetPosition[j] + (k + 1))) + (i + 2)] = {v: totalCount, t: 'n'};
//                     championBanMatchSheet[(excel.utils.encode_col(won_ChampionSheetPosition[j] + (k + 1))) + (i + 2)] = {v: winCount, t: 'n'};
//                 }
//             }
//         }
//     }    

//     let body = xlsx.Sheets["플레이어 별 픽수 승수"];
//     let columnCount = excel.utils.decode_range(body['!ref']).e.c;
//     let position = [];
//     let won_position = [];

//     body['A1'] = {t: 'n', v: matchCount};
    
//     for(let i = 0; i < normal_Keyword.length; ++i){
//         for(let j = 0; j < columnCount; ++j){
//             let column = excel.utils.encode_col(j) + '1';
//             if(body[column] != undefined && body[column].v == normal_Keyword[i]){
//                 position.push(j);
//             }

//             if(body[column] != undefined && body[column].v == won_Keyword[i]){
//                 won_position.push(j);
//                 break;
//             }
//         }

//         if(position[i] == undefined || won_position[i] ==undefined){
//             throw '플레이어 별 픽수 승수 시트 분석중 포지션 행열을 가져올 수 없습니다.';
//         }
//         console.log(normal_Keyword[i], '의 열 번호는', position[i], excel.utils.encode_col(position[i]), '입니다.');
//         console.log(won_Keyword[i], '의 열 번호는', won_position[i], excel.utils.encode_col(won_position[i]), '입니다.');
//     }

//     let championCount = position[1] - position[0];
//     console.log('모든 챔피언 개수는', championCount, '입니다.');

//     let i = 5;
//     for(let k = 0; k < lol_position.length; ++k){
//         for(let key in summoners){
//             body['A' + i] = {v: key};
            
//             if(summoners[key][lol_position[k]] == undefined){
//                 console.log(key, '유저는', lol_position[k], '의 정보가 없습니다.');
//                 continue;
//             }

//             console.log(lol_position[k], '열 찾기를 시작합니다.');

//             for(let key2 in summoners[key][lol_position[k]]){
//                 for(let j = 0; j < championCount; ++j){
//                     let totalColumn = excel.utils.encode_col(position[k] + j);
//                     let wonColumn = excel.utils.encode_col(won_position[k] + j);

//                     if(body[totalColumn + 2].v == key2){
//                         let totalCount = 0;
//                         let wonCount = 0;
//                         for(let iter in summoners[key][lol_position[k]][key2]){
//                             totalCount += summoners[key][lol_position[k]][key2][iter].total;
//                             wonCount += summoners[key][lol_position[k]][key2][iter].win;
//                         }
//                         body[totalColumn + i] = {v: totalCount, t: 'n'};
//                         body[wonColumn + i] = {v: wonCount, t: 'n'};

//                         break;
//                     }
//                 }
//             }

//             ++i;
//         }
//     }

//     let range = excel.utils.decode_range(body['!ref']);
//     range.e.r = i;
//     body['!ref'] = excel.utils.encode_range(range);
//     console.log(body['!ref']);

//     excel.writeFile(xlsx, 'result.xlsm');
// }

const port = 3000;
const key = 'RGAPI-59b35fb9-df4a-4081-9769-00c3b45471de';
const password = 'dudgh1106';
const time = 1.3;
const table = 'summoners';

const tiers = [
    'CHALLENGER I', 'GRANDMASTER I', 'MASTER I',
    'DIAMOND I', 'DIAMOND II', 'DIAMOND III', 'DIAMOND IV',
    'PLATINUM I', 'PLATINUM II',, 'PLATINUM III', 'PLATINUM IV',
    'GOLD I', 'GOLD II', 'GOLD III', 'GOLDI IV',
    'SILVER I', 'SILVER II', 'SILVER III', 'SILVER IV',
    'BRONZE I', 'BRONZE II', 'BRONZE III', 'BRONZE IV',
    'IRON I', 'IRON II', 'IRON III', 'IRON IV',
];

const errorcodes = [
    429,                // rate limit exceeded
    503,                // service unavailable
    504,                // gateway timeout
    undefined
];

const api = require('./source/APIHelper.js')(key, time);
const sql = require('./source/SQLHelper.js')(table);
sql.AutoConnect({
    host: 'localhost', 
    user: 'root', 
    password: password, 
    database: 'ddodgegg'
});
const helper = require('./source/ObjectHelper.js');
const excel = require('./source/ExcelHelper.js');

const express = require('express');
const bodyParser = require('body-parser');
const { text } = require('express');

const app = express();
app.locals.pretty = true;
app.set('view engine', 'pug');
app.set('views', './pug');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

app.listen(port, function(){
    console.log('Net Connect Success: ', port);
});

app.get('/', function(req, res){
    res.render('main', {_title: 'DDODGE.GG', _time: Date(), _body: req.ip, _tiers: tiers});
});

var isRunning = false;
app.post('/', async function(req, res){
    let body = req.ip;
    let botton = req.body.button;

    if(isRunning){
        body = '현재 다른 작업이 진행중에 있습니다.';
    }
    else{
        isRunning = true;
        switch(botton){
            case 'TEST':
                Test2(req.body.prevDate, req.body.nextDate)
                .then(message => {
                    console.log('test complete', message);
                    isRunning = false;
                })
                .catch(message => {
                    console.log(message);
                    isRunning = false;
                });
            break;
            case 'REPLACE SUMMONERS':
                ReplaceSummoners(req.body.tiersDropDown)
                .then(message => {
                    console.log('----- Replace Summoners complete -----');
                    isRunning = false;
                })
                .catch(err => {
                    console.log('서머너 정보 갱신을 다시 시도하여 주십시오.\n', err);
                    isRunning = false;
                });
            break;
            case 'REMOVE SUMMONERS':
                RemoveSummoners(req.body.tiersDropDown2)
                .then(message => {
                    console.log ('----- Remove Summoners complete -----');
                    isRunning = false;
                })
                .catch(err => {
                    console.log('서머너 정보 삭제를 다시 시도하여 주십시오', err);
                    isRunning = false;
                });
            break;
            case 'REMOVE SUMMONERS ALL':
                RemoveALLSummoners()
                .then(message => {
                    console.log ('----- Remove Summoners complete -----');
                    isRunning = false;
                })
                .catch(err => {
                    console.log('서머너 정보 삭제를 다시 시도하여 주십시오', err);
                    isRunning = false;
                });
            break;
            case 'REPLACE MATCHES':
                ReplaceMatches(req.body.prevDate, req.body.nextDate)
                .then(message => {
                    console.log('---- Replace Matches complete -----');
                    isRunning = false;
                })
                .catch(err => {
                    console.log('매치 갱신 도중에 오류가 발생하였습니다.\n', err);
                    isRunning = false;
                });
            break;
            case 'INSERT INFORMATION':
                console.log('click insert with google-spreadsheet');
                isRunning = false;
            break;
            default:
                console.log('Unclear Body Value\nPlease Check Button Name or Value');
                isRunning = false;
            break;
        }
    }

    res.render('main', {_title: 'DDODGE.GG', _time: Date(), _body: body, _tiers: tiers});
});

async function ReplaceSummoners(fullTier){
    let words = fullTier.split(' ');
    let tier = words[0];
    let division = words[1];
    let currentUserCount = 205;
    let page = 1;
    while(currentUserCount == 205 && page <= 1000){
        try{
            let summoners = await api.GetLeagueUsers(tier, division, page);
            currentUserCount = summoners.length;
            
            for(let i = 0; i < summoners.length;){
                try{
                    let summoner = await api.Summoner(summoners[i].summonerName);
                    let success = await sql.Summoner(summoner, summoners[i].tier + ' ' + summoners[i].rank);
                    console.log(summoner.name, '유저의 DB 입력은', success, '하였습니다.', i + 1, '/', summoners.length);

                    ++i;
                }
                catch(err){
                    if(errorcodes.indexOf(err) == -1){
                        console.log(summoners[i].summonerName, '네트워크 오류', err);
                        ++i;
                    }
                }
            }

            ++page;
        }
        catch(err){
            if(errorcodes.indexOf(err) == -1){
                console.log(tier, division, page, '오류');
                ++page;
            }
        }
    }

    return '모든' + fullTier + '티어의 유저는 DB에 입력되었습니다.';
}

async function RemoveSummoners(fullTier){
    let result = await sql.RemoveSummonersWithTier(fullTier);

    return true;
}

async function RemoveALLSummoners(){
    let result = await sql.RemoveAllSummoners();

    return true;
}

async function ReplaceMatches(prevDate, nextDate){
    let tableName = 'match' + prevDate + '_' + nextDate;
    try{
        let tempTable = sql.CreateTable(tableName);
    }
    catch(err){
        console.log('테이블 생성에 실패', err);
    }

    console.log('시작날짜:', new Date(Number(prevDate)).toLocaleString(), '--- 종료날짜:', new Date(Number(nextDate)).toLocaleString());
    let result = await sql.GetAllSummoner();
    console.log(result.length, '명의 매치분석을 시작합니다.');

    for(let i = 0; i < result.length;){
        let currentMatches = [];
        try{
            console.log(result[i].name, '검사 시작');
            let matches = await api.GetMatchList(result[i].accountId, prevDate, nextDate);
            console.log(result[i].name, '의 매치 리스트 개수는', matches.matches.length, '개입니다.');

            for(let j = 0; j < matches.matches.length;){
                try{
                    if(currentMatches.indexOf(matches.matches[j].gameId) != -1){
                        console.log(matches.matches[j].gameId, '는 이미 검사한 매치입니다.');
                    }
                    else{
                        currentMatches.push(matches.matches[j].gameId);

                        let match = await api.GetMatch(matches.matches[j].gameId);
                        let result = await sql.InsertMatch(match, tableName);
                        
                        console.log(matches.matches[j].gameId, 'complete');
                    }

                    ++j;
                }
                catch(err){
                    if(errorcodes.indexOf(err) == -1){
                        console.log(result[i].name, result[i].accountId, '소환사의 매치 오류', err);
                        ++j;
                    }
                    else{
                        console.log(result[i].name, result[i].accountId, '소환사의 매치 재검사를 시작', err);
                    }
                }
            }

            ++i;
        }
        catch(err){
            if(errorcodes.indexOf(err) == -1){
                console.log(result[i].name, result[i].accountId, '소환사의 매치 리스트 오류', err);
                ++i;
            }
            else{
                console.log(result[i].name, result[i].accountId, '소환사의 매치리스트 재검사를 시작', err);
            }
        }
    }

    return true;
}

async function Test(prevDate, nextDate){
    console.log('----- Load Matches -----');
    let sqlMatches = await sql.GetMatches('match' + prevDate + '_' + nextDate);
    console.log('match Count: ' + sqlMatches.length);
    let matches = helper.MakeMatch(sqlMatches);

    /* Load Excel and Sheet */
    console.log('----- Load Excel -----');
    let xlsx = excel.Load('./10.15 통계처리기.xlsm');
    
    /* Get Champions */
    let championSheet = excel.GetSheet(xlsx, 'Champions');
    let championList = [];
    let championCount = excel.GetSheetRowCount(championSheet);
    for(let i = 2; i <= championCount + 1; ++i){
        let tempObj = { id: championSheet['A' + i].v, name: championSheet['B' + i].v };
        championList.push(tempObj);
    }

    let players = helper.GetPlayers(matches);
    let lol_position = ['TOP', 'JUNGLE', 'MIDDLE', 'DUO_CARRY', 'DUO_SUPPORT'];

    //#region Bans
    /*Insert Banlist*/
    console.log('----- Insert Ban -----');
    let banSheet = excel.GetSheet(xlsx, '밴 횟수  매치업 승수 픽수');
    let cell_ChampionID = 'A1';
    let text_ChampionID = 'Champion ID';
    let cell_ChampBanned = 'B1';
    let text_ChampBanned = 'Champ Banned';
    banSheet[cell_ChampionID] = { v: text_ChampionID, n: 's' };
    banSheet[cell_ChampBanned] = { v: text_ChampBanned, n: 's' };
    
    let bans = helper.GetBans(matches);
    for(let i = 0; i < championList.length; ++i){
        let currentRow = 2 + i;
        banSheet['A' + currentRow] = { v: championList[i].id, t: 'n'};
        if(championList[i].id in bans){
            banSheet['B' + currentRow] = { v: bans[championList[i].id], t: 'n' };
        }
    }

    /*insert each champion match*/
    console.log('----- insert ban match -----');
    let keyword = [
        'Number of Matchup : TOP', 
        '# of ↓ Won (vs →) : TOP', 
        'Number of Matchup : JGL', 
        '# of ↓ Won (vs →) : JGL', 
        'Number of Matchup : MID', 
        '# of ↓ Won (vs →) : MID', 
        'Number of Matchup : BOT', 
        '# of ↓ Won (vs →) : BOT', 
        'Number of Matchup : SPT', 
        '# of ↓ Won (vs →) : SPT'
    ];
    let currentColumn = 4;
    let rowCount = championList.length + 1;

    function GetBanWInCount(array, position, winChamp, lossChamp){
        let count = 0;
        for(const key in array){
            if(array[key] == undefined){
                continue;
            }
            if(array[key][position] == undefined){
                continue;
            }
            // console.log(array[key][position]);
            if(array[key][position][winChamp] == undefined){
                continue;
            }
            // console.log(array[key][position][winChamp]);
            if(array[key][position][winChamp][lossChamp] == undefined){
                continue;
            }
            count += array[key][position][winChamp][lossChamp]['win'];
        }

        return count;
    }
    function GetBanTotalCount(array, position, winChamp, lossChamp){
        let count = 0;
        for(const key in array){
            if(array[key] == undefined){
                continue;
            }
            if(array[key][position] == undefined){
                continue;
            }
            // console.log(array[key][position]);
            if(array[key][position][winChamp] == undefined){
                continue;
            }
            // console.log(array[key][position][winChamp]);
            if(array[key][position][winChamp][lossChamp] == undefined){
                continue;
            }
            count += array[key][position][winChamp][lossChamp]['total'];
        }
        return count;
    }

    console.log('----- 벤 매치업 횟수 검출 시작 -----');
    for(let i = 0; i < keyword.length; ++i, ++currentColumn){
        console.log('---', keyword[i], '---');
        banSheet[excel.GetSheetColumnWord(currentColumn) + 1] = { v: keyword[i], t: 's' };

        for(let j = 0; j < championList.length; ++j){
            banSheet[excel.GetSheetColumnWord(currentColumn) + (j + 2)] = {v: championList[j].id, t: 'n'};
        }

        ++currentColumn;
        for(let j = 0; j < championList.length; ++j, ++currentColumn){
            banSheet[excel.GetSheetColumnWord(currentColumn) + 1] = {v: championList[j].id, t: 'n'};
            for(let k = 0; k < championList.length; ++k){
                let tempCount = 0;
                if(i % 2 == 0){
                    tempCount = GetBanTotalCount(players, lol_position[(i / 2)], championList[k].id, championList[j].id);
                }
                else{
                    tempCount = GetBanWInCount(players, lol_position[parseInt(i / 2)], championList[k].id, championList[j].id);
                }
                banSheet[excel.GetSheetColumnWord(currentColumn) + (k + 2)] = {v: tempCount, t: 'n'};
            }
        }
    }

    console.log(banSheet['!ref']);
    banSheet['!ref'] = 'A1:' + excel.GetSheetColumnWord(currentColumn) + rowCount;
    // excel.Save(xlsx, 'Result.xlsm');
    //#endregion

    //#region player Sheet.. twice
    let playerPickSheet = excel.GetSheet(xlsx, '플레이어 별 픽수');
    let playerWinSheet = excel.GetSheet(xlsx, '플레이어 별 승수');
    let exceptPickSheet = excel.GetSheet(xlsx, '플레이어 별 해당 챔프 제외 픽수');
    let exceptWinSheet = excel.GetSheet(xlsx, '플레이어 별 해당 챔프 제외 승수');

    function Initialize(sheet){
        sheet['A1'] = { v: 'Total Games', t: 's'};
        sheet['A2'] = { v: matches.length, t: 'n'};
        sheet['C1'] = { v: 'Start Time (in UTC)', t: 's'};
        sheet['C2'] = { v: prevDate, t: 'n'};
        sheet['D1'] = { v: 'End Time (in UTC)', t: 's'};
        sheet['D2'] = { v: nextDate, t: 'n'};
        sheet['A4'] = { v: 'Nickname', t: 's'};
        sheet['B4'] = { v: 'Summoner ID', t: 's'};
        sheet['C4'] = { v: 'Account ID', t: 's'};
        sheet['D4'] = { v: 'Tier', t: 's'};
        sheet['E4'] = { v: 'Division', t: 's'};
        sheet['F4'] = { v: 'Players', t: 's'};
        sheet['F3'] = { v: 'Total', t: 's'};
        sheet['F2'] = { v: 'Champ Index', t: 's'};
    }
    Initialize(playerPickSheet);
    Initialize(playerWinSheet);
    Initialize(exceptPickSheet);
    Initialize(exceptWinSheet);

    function InsertCell(row, column, value){
        playerPickSheet[excel.GetSheetColumnWord(column) + row] = {v: value, t: 'n'};
        playerWinSheet[excel.GetSheetColumnWord(column) + row] = {v: value, t: 'n'};
        exceptPickSheet[excel.GetSheetColumnWord(column) + row] = {v: value, t: 'n'};
        exceptWinSheet[excel.GetSheetColumnWord(column) + row] = {v: value, t: 'n'};
    } 
    let currentColumn2 = 5;
    let playercount = 5;
    for(const key in players){
        playerPickSheet[excel.GetSheetColumnWord(currentColumn2) + playercount] = {v: key, t: 's'};
        playerWinSheet[excel.GetSheetColumnWord(currentColumn2) + playercount] = {v: key, t: 's'};
        exceptPickSheet[excel.GetSheetColumnWord(currentColumn2) + playercount] = {v: key, t: 's'};
        exceptWinSheet[excel.GetSheetColumnWord(currentColumn2) + playercount] = {v: key, t: 's'};
        ++playercount;
    }
    ++currentColumn2
    for(let i = 0; i < lol_position.length; ++i, ++currentColumn2){
        playerPickSheet[excel.GetSheetColumnWord(currentColumn2) + 1] = {v: lol_position[i], t: 's'};
        playerWinSheet[excel.GetSheetColumnWord(currentColumn2) + 1] = {v: lol_position[i], t: 's'};
        exceptPickSheet[excel.GetSheetColumnWord(currentColumn2) + 1] = {v: lol_position[i], t: 's'};
        exceptWinSheet[excel.GetSheetColumnWord(currentColumn2) + 1] = {v: lol_position[i], t: 's'};

        for(let j = 0; j < championList.length; ++j, ++currentColumn2){
            console.log('--- position: ', lol_position[i], 'champ: ', championList[j], '---');
            InsertCell(2, currentColumn2, championList[j].id);

            let playerCount = 0;
            let wholeTotalCount = 0;
            let wholeWinCount = 0;
            let exceptCount = 0;
            let exceptWholeTotalCount = 0;
            let exceptWholeWinCount = 0;
            let row = 5;
            for(const player in players){
                let totalCount = 0;
                let winCount = 0;
                let exceptWinCount = 0;
                let exceptTotalCount = 0;
                if(lol_position[i] in players[player]){
                    if(championList[j].id in players[player][lol_position[i]]){
                        for(const champ in players[player][lol_position[i]]){
                            let isOne = false;
                            if(championList[j].id == champ){
                                ++playerCount;
                                for(const enermy in players[player][lol_position[i]][champ]){
                                    totalCount += players[player][lol_position[i]][champ][enermy]['total'];
                                    winCount += players[player][lol_position[i]][champ][enermy]['win'];
                                    wholeTotalCount += totalCount;
                                    wholeWinCount += winCount;
                                }
                            }
                            else{
                                if(isOne == false){
                                    ++exceptCount;
                                    isOne = true;
                                }
                                for(const enermy in players[player][lol_position[i]][champ]){
                                    exceptTotalCount += players[player][lol_position[i]][champ][enermy]['total'];
                                    exceptWinCount += players[player][lol_position[i]][champ][enermy]['win'];
                                    exceptWholeTotalCount += exceptTotalCount;
                                    exceptWholeWinCount += exceptWinCount;
                                }
                            }
                        }
                    }
                }

                playerPickSheet[excel.GetSheetColumnWord(currentColumn2) + row] = { v: totalCount, t: 'n'};
                playerWinSheet[excel.GetSheetColumnWord(currentColumn2) + row] = { v: winCount, t: 'n'};
                exceptPickSheet[excel.GetSheetColumnWord(currentColumn2) + row] = { v: exceptTotalCount, t: 'n'};
                exceptWinSheet[excel.GetSheetColumnWord(currentColumn2) + row] = { v: exceptWinCount, t: 'n'};
                ++row;
            }

            // playerPickSheet[excel.GetSheetColumnWord(currentColumn2) + 3] = { v: wholeTotalCount, t: 'n'};
            // playerWinSheet[excel.GetSheetColumnWord(currentColumn2) + 3] = { v: wholeWinCount, t: 'n'};
            // exceptPickSheet[excel.GetSheetColumnWord(currentColumn2) + 3] = { v: exceptWholeTotalCount, t: 'n'};
            // exceptWinSheet[excel.GetSheetColumnWord(currentColumn2) + 3] = { v: exceptWholeWinCount, t: 'n'};
            playerPickSheet[excel.GetSheetColumnWord(currentColumn2) + 3] = { f: 'SUM(' + excel.GetSheetColumnWord(currentColumn2) + 5 + ':' + excel.GetSheetColumnWord(currentColumn2) + playercount + ')'};
            playerWinSheet[excel.GetSheetColumnWord(currentColumn2) + 3] = { f: 'SUM(' + excel.GetSheetColumnWord(currentColumn2) + 5 + ':' + excel.GetSheetColumnWord(currentColumn2) + playercount + ')'};
            exceptPickSheet[excel.GetSheetColumnWord(currentColumn2) + 3] = { f: 'SUM(' + excel.GetSheetColumnWord(currentColumn2) + 5 + ':' + excel.GetSheetColumnWord(currentColumn2) + playercount + ')'};
            exceptWinSheet[excel.GetSheetColumnWord(currentColumn2) + 3] = { f: 'SUM(' + excel.GetSheetColumnWord(currentColumn2) + 5 + ':' + excel.GetSheetColumnWord(currentColumn2) + playercount + ')'};
        }
    }

    function SetSheetRange(row, culumn){
        playerPickSheet['!ref'] = 'A1:' + excel.GetSheetColumnWord(culumn) + row;
        playerWinSheet['!ref'] = 'A1:' + excel.GetSheetColumnWord(culumn) + row;
        exceptPickSheet['!ref'] = 'A1:' + excel.GetSheetColumnWord(culumn) + row;
        exceptWinSheet['!ref'] = 'A1:' + excel.GetSheetColumnWord(culumn) + row;
    }
    SetSheetRange(playercount, currentColumn2);
    excel.Save(xlsx, 'Result.xlsm');
    //#endregion

    return true;
}

async function Test2(prevDate, nextDate){
    console.log('----- Load Matches -----');
    let sqlMatches = await sql.GetMatches('match' + prevDate + '_' + nextDate);
    console.log('match Count: ' + sqlMatches.length);
    let matches = helper.MakeMatch(sqlMatches);

    let temp = excel.Load('test.xlsx');
    let sheet = excel.GetSheet(temp, 'Sheet1');

    let row = 1;
    function InsertCell(tempsheet, row, column, value, type = 'n'){
        tempsheet[excel.GetSheetColumnWord(column) + row] = {v: value, t: type};
    }
    matches.forEach(element => {
        let column = 0;
        console.log(element['gameId']);
        InsertCell(sheet, row, column, element['gameId']);
        element.bans.forEach(ban => {
            ++column
            InsertCell(sheet, row, column, ban);
        });
        element.winTeam.forEach(winPlayer => {
            ++column;
            if(winPlayer == undefined){
                InsertCell(sheet, row, column, 'NONE', 's');    
                ++column;
                InsertCell(sheet, row, column, 0);
            }
            else{
                InsertCell(sheet, row, column, winPlayer['name'], 's');
                ++column;
                InsertCell(sheet, row, column, winPlayer['championId']);
            }
        });
        element.lossTeam.forEach(lossPlayer => {
            ++column;
            if(lossPlayer == undefined){
                InsertCell(sheet, row, column, 'NONE', 's');    
                ++column;
                InsertCell(sheet, row, column, 0);
            }
            else{
                InsertCell(sheet, row, column, lossPlayer['name'], 's');
                ++column;
                InsertCell(sheet, row, column, lossPlayer['championId']);
            }
        });

        ++row;
    });

    let saveColumn = 31;
    
    function SetSheetRange(row, culumn){
        sheet['!ref'] = 'A1:' + excel.GetSheetColumnWord(culumn) + row;
        sheet['!ref'] = 'A1:' + excel.GetSheetColumnWord(culumn) + row;
        sheet['!ref'] = 'A1:' + excel.GetSheetColumnWord(culumn) + row;
        sheet['!ref'] = 'A1:' + excel.GetSheetColumnWord(culumn) + row;
    }
    SetSheetRange(matches.length, saveColumn);
    excel.Save(temp, 'Test2.xlsm');
}