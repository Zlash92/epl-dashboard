import {round} from "mathjs";
import chain from 'lodash'

const httpRequest = url => fetch(url).then(res => res.json())

export const getUnderstatPlayers = () => httpRequest("/api/league-players")

export const getFplStats = () => httpRequest("/api/fpl")

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

                const formattedUnderstats = {
                    ...stats,
                    xG: round(stats.xG, 2),
                    xA: round(stats.xA, 2),
                    time: parseInt(stats.time),
                    goals: parseInt(stats.goals),
                    assists: parseInt(stats.assists)
                }

                if (playerFplStats === null) {
                    console.log(`${playerFplStats} is not mapped`)

                    return {
                        ...formattedUnderstats,
                    }
                } else {
                    return {
                        ...formattedUnderstats,
                        now_cost: formatCost(playerFplStats.now_cost),
                        total_points: parseInt(playerFplStats.total_points)
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

const findFplStatsByUnderstatsName = (understatName, fplStatsByWebName) => {
    const mappedName = mapUnderstatToFplName(understatName)
    const fplStats = fplStatsByWebName[mappedName]

    if (fplStats === undefined) {
        console.log(`${understatName} is not mapped`)
        return null
    } else if (fplStats.length === 1) {
        return fplStats[0]
    } else {  // Multiple entries for same web name. Need to match on first name
        return fplStats.find(player => player["first_name"].includes(understatName.split("")[0]))
    }
}

const normalizeName = name => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()