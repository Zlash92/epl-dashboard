import {round} from "mathjs";
import chain from 'lodash'
import fetch from "node-fetch";

const queryString = require('query-string');

const httpRequest = url => {
    return fetch(url).then(res => res.json())
}

const getFplStats = () => httpRequest("/api/fpl")
const getUnderstatPlayers = () => httpRequest("/api/league-players")

export const getAllUnderstatPlayersMatches = () => httpRequest("/api/player-matches/all")
const getSingleUnderstatPlayerMatches = playerId => httpRequest(`/api/player-matches/${playerId}`)
export const getUnderstatPlayersMatches = playerIds => {
    const queryParams = queryString.stringify({playerIds});
    const url = `/api/player-matches?${queryParams}`

    return httpRequest(url)
}

export const getPlayers = () => (
    Promise.all([getUnderstatPlayers(), getFplStats()])
        .then(([understats, fplStats]) => {
            const fplStatsByWebName = chain(fplStats['elements'])
                .groupBy("web_name")
                .value()

            const fplStatsByWebNameNormalized = Object.keys(fplStatsByWebName).reduce((map, key) => (
                {
                    ...map,
                    [normalizeName(key)]: fplStatsByWebName[key]
                }
            ), {})

            return understats.map(stats => {
                const playerFplStats = findFplStatsByUnderstatsName(stats["player_name"], fplStatsByWebNameNormalized)
                const per90minFactor = stats.time / 90

                const formattedUnderstats = {
                    id: stats.id,
                    team: stats.team_title,
                    appearances: stats.games,
                    player_name: stats.player_name,
                    xG: round(stats.xG, 2),
                    xA: round(stats.xA, 2),
                    shots: round(stats.shots, 2),
                    time: parseInt(stats.time),
                    goals: parseInt(stats.goals),
                    assists: parseInt(stats.assists),
                    xGBuildup: parseInt(stats.xGBuildup),
                    xGChain: parseInt(stats.xGChain),
                    key_passes: parseInt(stats.key_passes),
                    goals90: round(stats.goals / per90minFactor, 2),
                    assists90: round(stats.assists / per90minFactor, 2),
                    shots90: round(stats.shots / per90minFactor, 2),
                    xG90: round(stats.xG / per90minFactor, 2),
                    xA90: round(stats.xA / per90minFactor, 2),
                    xGBuildup90: round(stats.xGBuildup / per90minFactor, 2),
                    xGChain90: round(stats.xGChain / per90minFactor, 2),
                    key_passes90: round(stats.key_passes / per90minFactor, 2),
                }

                if (playerFplStats === null) {
                    console.log(`${playerFplStats} is not mapped`)

                    return {
                        ...formattedUnderstats,
                    }
                } else {
                    if (playerFplStats === undefined) console.log("now_cost fail",stats["player_name"])
                    return {
                        ...formattedUnderstats,
                        now_cost: formatCost(playerFplStats.now_cost),
                        total_points: parseInt(playerFplStats.total_points)
                    }
                }

            })
        })
)

export const getSinglePlayerMatches = playerIds => {
    const results = playerIds.map(playerId => getSingleUnderstatPlayerMatches(playerId))
    return Promise.all(results)
        .then(allMatchStats => allMatchStats)
}

const formatCost = cost => parseFloat((cost / 10).toFixed(1))

const mapUnderstatToFplName = understatName => {
    // Key: Understat player_name; Value: Fpl web_name
    const correctionsTable = {
        "heung-min": "son",
        "ghazi": "el ghazi",
        "reid": "decordova-reid",
        "bruyne": "de bruyne",
        "alvaro": "ndombele",
        "ngoyo": "konsa",
        "dijk": "van dijk",
        "romeu": "oriol romeu",
        "moura": "lucas moura",
        "celso": "lo celso",
        "nouri": "ait nouri",
        "allister": "mac allister",
        "beek": "van de beek",
        "alcantara": "thiago",
        "gea": "de gea",
        "aanholt": "van aanholt",
        "soares": "cedric",
        "oxlade-chamberlain": "chamberlain",
        "elmohamady": "el mohamady",
        "gomes": "andre gomes",
        "rodri": "rodrigo",
        "marchand": "le marchand",
        "hegazy": "hegazi",
        "kepa": "arrizabalaga",
        "zambo": "anguissa",
        "smith-rowe": "smith rowe",
        "vinicius": "carlos vinicius",
        "odegaard": "ødegaard",
        "jose": "willian jose",
        "o&#039;connell": "o'connell",
        "n&#039;lundulu": "n'lundulu",
        "o&#039;shea": "o'shea",
        "alli": "dele"
    }

    const normalizedName = normalizeName(understatName.split(' ').pop())

    return understatName === "David Luiz" || understatName === "Douglas Luiz" || understatName === "Sean Longstaff"
        ? understatName.toLowerCase()
        : understatName === "Matthew Longstaff" ? "matty longstaff"
        : understatName === "Bernardo Silva" ? "bernardo"
        : understatName === "Adam Armstrong" ? "a.armstrong"
        : understatName === "Juan Camilo Hernández" ? "cucho"
        : correctionsTable[normalizedName] || normalizedName
}

const findFplStatsByUnderstatsName = (understatName, fplStatsByWebName) => {
    const mappedName = mapUnderstatToFplName(understatName)
    const fplStats = fplStatsByWebName[mappedName]

    if (fplStats === undefined) {
        console.log(`${understatName} is not mapped. Mapped name that failed: ${mappedName}`)
        return null
    } else if (fplStats.length === 1) {
        return fplStats[0]
    } else {  // Multiple entries for same web name. Need to match on first name
        return fplStats.find(player => player["first_name"].includes(understatName.split("")[0]))
    }
}

const normalizeName = name => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()