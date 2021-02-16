import fetch from "node-fetch";
import {PLAYER_MATCHES_URL} from "./index";

const queryString = require('query-string');

export default async (request, response) => {
    console.log("MULTI")
    const {playerIds} = request.query

    const playerIdsQueryParams = queryString.stringify({playerIds});

    const res = await fetch(`${PLAYER_MATCHES_URL}?${playerIdsQueryParams}`)
    const data = await res.json()

    return response.send(data);

};