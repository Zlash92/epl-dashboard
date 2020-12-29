import DataTable from "./Table";
import React, {useEffect, useState} from "react";
import styled from "@emotion/styled";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import {getFplStats, getPlayers, getUnderstatPlayers} from "./api/api";

const tableCellWidth = 100
const commonColFields = {headerAlign: 'center', align: 'left'}

const columns = [
    {...commonColFields, field: 'id', headerName: 'ID', width: tableCellWidth},
    {...commonColFields, field: 'player_name', headerName: 'Name', width: 200},
    {...commonColFields, field: 'team_title', headerName: 'Team', width: 150},
    {...commonColFields, field: 'games', headerName: 'Apps', width: tableCellWidth},
    {...commonColFields, field: 'time', headerName: 'Min', width: tableCellWidth},
    {...commonColFields, field: 'goals', headerName: 'G', width: tableCellWidth},
    {...commonColFields, field: 'assists', headerName: 'Assists', width: tableCellWidth},
    {...commonColFields, field: 'xG', headerName: 'xG', width: tableCellWidth},
    {...commonColFields, field: 'xA', headerName: 'xA', width: tableCellWidth},
    {...commonColFields, field: 'now_cost', headerName: 'Cost', width: tableCellWidth},
    {...commonColFields, field: 'total_points', headerName: 'Points', width: tableCellWidth},
    // { field: 'xG90', headerName: 'xG90', width: tableCellWidth },  // TODO: xG / (time/90)
    // { field: 'xA90', headerName: 'xA90', width: tableCellWidth },  // TODO: xA / (time/90)
];

const ContainerDiv = styled.div`
    min-height: 100vh;
    background-color: #282c34;
    display: flex;
    flex-direction: column
`

const useStyles = makeStyles({
    input: {
        '& .MuiInputBase-input': {
            color: '#fbfbfb'
        },

    },
    label: {
        '& .MuiFormLabel-root': {
            color: '#fbfbfb',
        }
    }

});

const PlayersTable = () => {
    const [leaguePlayers, setLeaguePlayers] = useState([])
    const [query, setQuery] = useState("")
    console.log(leaguePlayers)
    const classes = useStyles()

    useEffect(() => {
        console.log("FETCHING DATA")
        // getUnderstatPlayers()
        //     .then(res => setLeaguePlayers(res))
        //     .catch(error => console.log(error))
        //
        // getFplStats()
        //     .then(res => console.log(res))

        getPlayers()
            .then(res => setLeaguePlayers(res))
            .catch(error => console.log(error))
    }, []);

    const onPlayerSearch = (event) => {
        const query = event.target.value
        console.log(query)
        setQuery(query)
    }

    const filterPlayers = (players, query) => {
        return players.filter(player => {
            return player['player_name'].toLowerCase().includes(query.toLowerCase())
        })
    }

    return (
        <ContainerDiv>
            <TextField
                className={classes.label}
                onChange={onPlayerSearch}
                id="standard-search"
                label="Player search"
                type="search"
                InputProps={{
                    className: classes.input
                }}
            />
            <DataTable data={filterPlayers(leaguePlayers, query)} colHeaders={columns}/>
        </ContainerDiv>
    )
}

export default PlayersTable;