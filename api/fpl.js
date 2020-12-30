import rp from 'request-promise';
import {FANTASY_PREMIER_LEAGUE_URL} from "./index";

export default async (req, res) => {
    const result = await rp({
        uri: FANTASY_PREMIER_LEAGUE_URL,
        json: true
    })

    return res.send(result)
};