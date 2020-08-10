const sql = require('mysql');
const helper = require('./ObjectHelper.js');

var connection;
var table;

function SetTable(name){
    table = name;
}

function Connect(config){
    connection = sql.createConnection(config);
    connection.on('error', function (err) {
        if(!err.fatal){
            return;
        }

        if(err.code != 'PROTOCOL_CONNECTION_LOST'){
            throw err;
        }

        console.log('Re-connecting lost connection: ' + err.stack);

        Connect(config);
        connection.connect();
    });

    connection.connect();
}

function Request(sql, params){
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, rows, fields) => {
            if(err){
                console.log('콘솔에서 데이터를 가져오기 또는 삽입을 실패하였습니다.');
                reject(err);
            }
            else{
                resolve(rows);
            }
        });
    });
}

async function CreateTable(name){
    let sql = 'CREATE TABLE ' + name +
    ' (gameId VARCHAR(10), ' + 
    'bans VARCHAR(40), ' + 
    'winPlayer1 VARCHAR(25), ' + 
    'winPlayer2 VARCHAR(25), ' + 
    'winPlayer3 VARCHAR(25), ' + 
    'winPlayer4 VARCHAR(25), ' + 
    'winPlayer5 VARCHAR(25), ' + 
    'lossPlayer1 VARCHAR(25), ' + 
    'lossPlayer2 VARCHAR(25), ' + 
    'lossPlayer3 VARCHAR(25), ' + 
    'lossPlayer4 VARCHAR(25), ' + 
    'lossPlayer5 VARCHAR(25), ' + 
    'PRIMARY KEY (gameId)' + 
    ');'

    let result = await Request(sql);

    return result;
}

async function InsertSummoner(summoner, tier){
    let params = [summoner.id, summoner.accountId, summoner.puuid, summoner.name, 
    summoner.profileIconId, summoner.revisionDate, summoner.summonerLevel, tier];
    let sql = 'INSERT IGNORE INTO ' + table + ' (id, accountId, puuid, name, profileIconId, revisionDate, summonerLevel, tier) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
    
    let result = await Request(sql, params);

    return true;
}

async function GetAllSummoners(){
    let sql = 'SELECT * FROM ' + table;
    let sqlResult = await Request(sql);
    
    return sqlResult;
}

async function GetSummonersWithTier(tier){
    let params = [tier]
    let sql = 'SELECT * FROM ' + table + ' WHERE tier=?';
    let sqlResult = await Request(sql, params);
    
    return sqlResult;
}

async function RemoveSummonersWithTier(tier){
    let params = [tier];
    let sql = 'DELETE FROM ' + table + ' WHERE tier=?';

    let result = await Request(sql, params);

    return true;
}

async function RemoveAllSummoners(){
    let sql = 'DELETE FROM ' + table;
    
    return await Request(sql);
}

// async function CheckTable(name) {
//     // let sql = 'SELECT * FROM ' + table + ' WHERE ' + name + '=$table_array';
//     let sql = "SHOW TABLES LIKE '".$table."'"

//     let result = Request(sql);

//     return result;
// }

async function GetMatches(name){
    let sql = 'SELECT * FROM ' + name;

    let result = await Request(sql);

    return result;
}

async function InsertMatch(match, tableName) {
    let bans = helper.MakeBans(match);
    let winteam = helper.GetWinTeam(match);
    let lossteam = helper.GetLossTeam(match);

    let insertBans = "";
    for(let i = 0; i < bans.length - 1; ++i){
        insertBans += bans[i].toString() + '/';
    }
    insertBans += bans[bans.length - 1].toString();

    let positionName = ['TOP', 'JUNGLE', 'MIDDLE', 'DUO_CARRY', 'DUO_SUPPORT']
    let players = [];
    for(let i = 0; i < positionName.length; ++i){
        if(winteam[positionName[i]] != undefined){
            let tempPlayer = winteam[positionName[i]].name + '/' + winteam[positionName[i]].championId;
            players.push(tempPlayer);
        }
        else{
            players.push("NONE");
        }
    }
    for(let i = 0; i < positionName.length; ++i){
        if(lossteam[positionName[i]] != undefined){
            let tempPlayer = lossteam[positionName[i]].name + '/' + lossteam[positionName[i]].championId;
            players.push(tempPlayer);
        }
        else{
            players.push("NONE");
        }
    }

    let params = [match.gameId, insertBans];
    params = params.concat(players);
    let sql = 'INSERT IGNORE INTO ' + tableName + 
    ' (gameId, bans, winPlayer1, winPlayer2, winPlayer3, winPlayer4, winPlayer5, ' + 
    'lossPlayer1, lossPlayer2, lossPlayer3, lossPlayer4, lossPlayer5) ' + 
    'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    let result = await Request(sql, params);

    return result;
}

module.exports = function(tableName){
    table = tableName;
    
    return{
        CreateTable: CreateTable, 
        // CheckTable: CheckTable, 
        SetTable: SetTable, 
        AutoConnect: Connect, 
        Request: Request, 
        Summoner: InsertSummoner, 
        GetAllSummoner: GetAllSummoners, 
        GetSummonerWithTier: GetSummonersWithTier, 
        RemoveSummonersWithTier: RemoveSummonersWithTier, 
        RemoveAllSummoners: RemoveAllSummoners, 
        GetMatches: GetMatches, 
        InsertMatch: InsertMatch
    }
}