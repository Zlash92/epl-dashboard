import './App.css';
import React, {useEffect, useState} from "react";
import styled from "@emotion/styled";
import PlayersTable from "./PlayersTable";
import {COLOR_BACKGROUND_DARK_BLUE} from "./Colors";
import {getPlayers, getUnderstatPlayersMatches} from "./api/api";
import TopPlayersTable from "./TopPlayersTable";

const queryString = require('query-string');

const WrapperDiv = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${COLOR_BACKGROUND_DARK_BLUE};
  //justify-content: center;
  align-items: center;
`

const App = () => {
    const [leaguePlayers, setLeaguePlayers] = useState([])
    const [playersMatches, setPlayersMatches] = useState([])

    useEffect(() => {
        console.log("Fetch league players")
        getPlayers()
            .then(res => setLeaguePlayers(res))
            .catch(error => console.log(error))
        console.log("Done fetching league players")
    }, []);

    useEffect(() => {
        console.log("Fetch players matches")
        const playerIds = leaguePlayers.map(player => player.id)
        console.time("matches")
        if (leaguePlayers.length > 0) {  // TODO: Remove
            getUnderstatPlayersMatches(playerIds)
                .then(data => {
                    // Get names
                    console.timeEnd("matches")
                    console.log("Finished fetching players matches")

                    console.log("players matches data", data)
                    const augmentedData = data.map((playerMatches, index) => ({
                        matches: playerMatches,
                        player_name: leaguePlayers[index].player_name,
                        team: leaguePlayers[index].team
                    }))
                    setPlayersMatches(augmentedData)
                })
        }
    }, [leaguePlayers])

    return (
        <WrapperDiv>
            <PlayersTable playersData={leaguePlayers} />
            <TopPlayersTable playersData={playersMatches}/>
        </WrapperDiv>
    );
}

export default App;
