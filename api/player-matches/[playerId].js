import fetch from "node-fetch";
import {PLAYER_MATCHES_URL} from "../index";

export default async (request, response) => {
    console.log("One player id")
    const { playerId } = request.query

    const res = await fetch(`${PLAYER_MATCHES_URL}/${playerId}`);
    const data = await res.json();

    return response.send(data);

};