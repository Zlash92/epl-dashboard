import {round} from "mathjs";

export const LEAGUE_PLAYERS_STATS_URL = "https://3hg93n5vqg.execute-api.eu-north-1.amazonaws.com/test/league-players"
export const FANTASY_PREMIER_LEAGUE_URL = "https://fantasy.premierleague.com/api/bootstrap-static/#/"

export const httpRequest = url => fetch(url).then(res => res.json())

export const getUnderstatPlayers = () => httpRequest(LEAGUE_PLAYERS_STATS_URL)

export const getFplStats = () => httpRequest(FANTASY_PREMIER_LEAGUE_URL)

export const getPlayers = () => (
    Promise.all([getUnderstatPlayers(), getFplStats()])
        .then(([understats, fplStats]) => {
            const fplStatsByPlayerName = fplStats['elements'].reduce((map, player) => {
                    const playerName = player["web_name"]
                    return {
                        ...map,
                        [normalizeName(playerName)]: player
                    }
                }, {}
            )

            return understats.map(stats => {
                const playerName = mapUnderstatToFplName(stats["player_name"])

                const formattedStats = {
                    ...stats,
                    xG: round(stats.xG, 2),
                    xA: round(stats.xA, 2),
                    time: parseInt(stats.time),
                    goals: parseInt(stats.goals),
                    assists: parseInt(stats.assists)
                }

                if (fplStatsByPlayerName[playerName] === undefined) {
                    console.log(`${playerName} is not mapped`)


                    return {
                        ...formattedStats,
                    }
                } else {
                    return {
                        ...formattedStats,
                        now_cost: formatCost(fplStatsByPlayerName[playerName]["now_cost"]),
                        total_points: parseInt(fplStatsByPlayerName[playerName].total_points)
                    }
                }

            })
        })
)

const formatCost = cost => parseFloat((cost / 10).toFixed(1))

const mapUnderstatToFplName = understatName => {
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
        "o&#039;connell": "o'connell",
        "n&#039;lundulu": "n'lundulu",
        "o&#039;shea": "o'shea"
    }

    const normalizedName = normalizeName(understatName.split(' ').pop())

    return understatName === "David Luiz" || understatName === "Douglas Luiz" || understatName === "Sean Longstaff"
        ? understatName.toLowerCase()
        : understatName === "Matthew Longstaff" ? "matty longstaff"
        : correctionsTable[normalizedName] || normalizedName
}

const normalizeName = name => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()