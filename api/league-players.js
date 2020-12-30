import fetch from 'node-fetch';
import {LEAGUE_PLAYERS_STATS_URL} from "./index";

export default async (request, response) => {
    const res = await fetch(LEAGUE_PLAYERS_STATS_URL);
    const data = await res.json();

    return response.send(data);
};