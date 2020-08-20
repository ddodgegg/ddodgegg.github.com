const port = 3000;
const key = 'RGAPI-79828dde-1e95-4265-933a-9bcdd39bb2d3';
const password = 'dudgh1106';
const delay = 1.3;
const table = 'summoners';
const excelName = '10.15 통계처리기.xlsx';

const tiers = [
    'CHALLENGER I', 'GRANDMASTER I', 'MASTER I',
    'DIAMOND I', 'DIAMOND II', 'DIAMOND III', 'DIAMOND IV',
    'PLATINUM I', 'PLATINUM II', 'PLATINUM III', 'PLATINUM IV',
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

const api = require('./source/APIHelper.js')(key, delay);
const sql = require('./source/SQLHelper.js')(table, {host: 'localhost', user: 'root', password: password, database: 'ddodgegg'});
const helper = require('./source/ObjectHelper.js');
const excel = require('./source/ExcelHelper.js');

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.locals.pretty = true;
app.set('view engine', 'pug');
app.set('views', './pug');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

// open server
app.listen(port, function(){
    console.log('Net Connect Success: ', port);
});

// riot.txt
app.get('/:fileName', function(req, res){
    let name = req.params.fileName;

    if(name != '' && fs.existsSync('./' + name)){
        const riot = fs.readFileSync('./' + name, 'utf8');

        res.send(riot);
        res.end();
    }
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
                Test(req.body.prevDate, req.body.nextDate)
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
                    let success = await sql.InsertSummoner(summoner, summoners[i].tier + ' ' + summoners[i].rank);
                    console.log(summoner.name, '유저의 DB 입력은', success, '하였습니다.', i + 1, '/', summoners.length);

                    ++i;
                }
                catch(err){
                    if(errorcodes.indexOf(err) == -1){
                        console.log(summoners[i].summonerName, '소환사의 정보 받아오기를 실패하였습니다. 다음 소환사로 넘어갑니다.\n', err);
                        ++i;
                    }
                }
            }

            ++page;
        }
        catch(err){
            if(errorcodes.indexOf(err) == -1){
                console.log(tier, division, page, '에서 유저 리스트 받아오기를 실패하엿습니다. 다음 리스트로 넘어갑니다.\n', err);
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
    let result = await sql.RemoveSummoners();

    return true;
}

async function ReplaceMatches(prevDate, nextDate){
    console.log('시작날짜:', new Date(Number(prevDate)).toLocaleString(), '--- 종료날짜:', new Date(Number(nextDate)).toLocaleString());

    
    let tableName = 'match' + prevDate + '_' + nextDate;
    let dbmatches = await sql.GetMatchIds(tableName);
    try{
        let tempTable = sql.CreateMatchesTable(tableName);
    }
    catch(err){
        console.log(tableName, '테이블 생성에 실패하였습니다.\n', err);
    }

    let result = await sql.GetSummoners();
    console.log(result.length, '명의 매치분석을 시작합니다.');

    for(let i = 0; i < result.length;){
        let currentMatches = [];
        try{
            console.log(result[i].name, '소환사의 전적기록 검사를 시작합니다.', i + 1, '/', result.length);
            let matches = await api.GetMatchList(result[i].accountId, prevDate, nextDate);
            console.log(result[i].name, '소환사의 전적기록 개수는', matches.matches.length, '개입니다.');

            for(let j = 0; j < matches.matches.length;){
                try{
                    if(currentMatches.indexOf(matches.matches[j].gameId) != -1 || dbmatches.indexOf(matches.matches[j].gameId) == -1){
                        console.log(matches.matches[j].gameId, '는 이미 검사한 매치입니다.');
                    }
                    else{
                        currentMatches.push(matches.matches[j].gameId);

                        let match = await api.GetMatch(matches.matches[j].gameId);
                        let result = await sql.InsertMatch(match, tableName);
                        
                        console.log(matches.matches[j].gameId, '매치의 검사를 완료하였습니다.');
                    }

                    ++j;
                }
                catch(err){
                    if(errorcodes.indexOf(err) == -1){
                        console.log(result[i].name, result[i].accountId, '소환사의', matches.matches[j].gameId, '의 검사에 실패하였습니다. 다음 매치로 넘어갑니다\n', err);
                        ++j;
                    }
                }
            }

            ++i;
        }
        catch(err){
            if(errorcodes.indexOf(err) == -1){
                console.log(result[i].name, result[i].accountId, '소환사의 전적기록 불러오기에 실패하였습니다. 다음 소환사로 넘어갑니다.\n', err);
                ++i;
            }
        }
    }

    return true;
}

async function Test(prevDate, nextDate){
    console.log('검색한 일자에 대한 매치 분석을 시작합니다.');
    let sqlMatches = await sql.GetMatches('match' + prevDate + '_' + nextDate);
    console.log(sqlMatches.length, '개의 매치가 검색되었습니다.');
    let matches = helper.MakeMatch(sqlMatches);

    /* Load Excel and Sheet */
    let xlsx = excel.Load('./excel/' + excelName);
    
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
    excel.Save(xlsx, 'Result.xlsx');
    //#endregion

    return true;
}

// async function Test2(prevDate, nextDate){
//     console.log('----- Load Matches -----');
//     let sqlMatches = await sql.GetMatches('match' + prevDate + '_' + nextDate);
//     console.log('match Count: ' + sqlMatches.length);
//     let matches = helper.MakeMatch(sqlMatches);

//     let temp = excel.Load('test.xlsx');
//     let sheet = excel.GetSheet(temp, 'Sheet1');

//     let row = 1;
//     function InsertCell(tempsheet, row, column, value, type = 'n'){
//         tempsheet[excel.GetSheetColumnWord(column) + row] = {v: value, t: type};
//     }
//     matches.forEach(element => {
//         let column = 0;
//         console.log(element['gameId']);
//         InsertCell(sheet, row, column, element['gameId']);
//         element.bans.forEach(ban => {
//             ++column
//             InsertCell(sheet, row, column, ban);
//         });
//         element.winTeam.forEach(winPlayer => {
//             ++column;
//             if(winPlayer == undefined){
//                 InsertCell(sheet, row, column, 'NONE', 's');    
//                 ++column;
//                 InsertCell(sheet, row, column, 0);
//             }
//             else{
//                 InsertCell(sheet, row, column, winPlayer['name'], 's');
//                 ++column;
//                 InsertCell(sheet, row, column, winPlayer['championId']);
//             }
//         });
//         element.lossTeam.forEach(lossPlayer => {
//             ++column;
//             if(lossPlayer == undefined){
//                 InsertCell(sheet, row, column, 'NONE', 's');    
//                 ++column;
//                 InsertCell(sheet, row, column, 0);
//             }
//             else{
//                 InsertCell(sheet, row, column, lossPlayer['name'], 's');
//                 ++column;
//                 InsertCell(sheet, row, column, lossPlayer['championId']);
//             }
//         });

//         ++row;
//     });

//     let saveColumn = 31;
    
//     function SetSheetRange(row, culumn){
//         sheet['!ref'] = 'A1:' + excel.GetSheetColumnWord(culumn) + row;
//         sheet['!ref'] = 'A1:' + excel.GetSheetColumnWord(culumn) + row;
//         sheet['!ref'] = 'A1:' + excel.GetSheetColumnWord(culumn) + row;
//         sheet['!ref'] = 'A1:' + excel.GetSheetColumnWord(culumn) + row;
//     }
//     SetSheetRange(matches.length, saveColumn);
//     excel.Save(temp, 'Test2.xlsx');
// }