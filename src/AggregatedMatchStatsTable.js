import React, {useEffect, useState} from "react";
import {getSinglePlayerMatches} from "./api/api";
import DataTable from "./Table";
import {number, round} from "mathjs";
import {range, sumBy} from "./Utils";
import {FormHelperText, MenuItem, Select} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import styled from "@emotion/styled";
import TextField from "@material-ui/core/TextField";
import {css} from "@emotion/core";
import {COLOR_TEXT_WHITE} from "./Colors";

const tableCellWidth = 100
const commonColFields = {headerAlign: 'center', align: 'left'}

const columns = [
    {...commonColFields, field: 'player_name', headerName: 'Name', width: 200},
    {...commonColFields, field: 'team', headerName: 'Team', width: 150},
    {...commonColFields, field: 'shots', headerName: 'Shots', width: tableCellWidth},
    {...commonColFields, field: 'time', headerName: 'Min', width: tableCellWidth},
    {...commonColFields, field: 'goals', headerName: 'G', width: tableCellWidth},
    {...commonColFields, field: 'assists', headerName: 'Assists', width: tableCellWidth},
    {...commonColFields, field: 'xG', headerName: 'xG', width: tableCellWidth},
    {...commonColFields, field: 'xA', headerName: 'xA', width: tableCellWidth},
    {...commonColFields, field: 'xGA', headerName: 'xG + xA', width: tableCellWidth},
    {...commonColFields, field: 'key_passes', headerName: 'Key Passes', width: tableCellWidth},  // TODO Per 90?
    // {...commonColFields, field: 'now_cost', headerName: 'Cost', width: tableCellWidth},
    // {...commonColFields, field: 'total_points', headerName: 'Points', width: tableCellWidth},
    // { field: 'xG90', headerName: 'xG90', width: tableCellWidth },  // TODO: xG / (time/90)
    // { field: 'xA90', headerName: 'xA90', width: tableCellWidth },  // TODO: xA / (time/90)
];

const ContainerDiv = styled.div`
  //min-height: 100vh;
  margin-bottom: 20px;
  background-color: #282c34;
  display: flex;
  flex-direction: column
`


const useStyles = makeStyles({
    select: {
        // backgroundColor: "black",
        borderColor: "black",
        color: COLOR_TEXT_WHITE
    },
    helperText: {
        color: COLOR_TEXT_WHITE
    },
    input: {
        '& .MuiInputBase-input': {
            color: COLOR_TEXT_WHITE
        },
    },
    label: {
        '& .MuiFormLabel-root': {
            color: COLOR_TEXT_WHITE,
        }
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const AggregatedMatchStatsTable = ({playersData = [], onRowSelected}) => {
    // const [query, setQuery] = useState("")
    const [numberOfGames, setNumberOfGames] = useState(3)
    const [playersMatches, setPlayersMatches] = useState([])

    const classes = useStyles()

    console.log("playersMatches", playersMatches)

    useEffect(() => {
        // Aggregate stats for last matches for each player
        console.time("aggregation")
        const aggregatedData = playersData.map(player => {
            if (!player.matches.hasOwnProperty("message")) {  // TODO
                const lastMatches = player.matches.slice(0, numberOfGames)
                // Add player name, team
                const stats = {
                    goals: sumBy(lastMatches, match => parseInt(match.goals)),
                    shots: sumBy(lastMatches, match => parseInt(match.shots)),
                    xG: sumBy(lastMatches, match => round(parseFloat(match.xG), 2)),
                    time: sumBy(lastMatches, match => parseInt(match.time)),
                    id: player.player_name,
                    xA: sumBy(lastMatches, match => round(parseFloat(match.xA), 2)),
                    assists: sumBy(lastMatches, match => parseInt(match.assists)),
                    key_passes: sumBy(lastMatches, match => parseInt(match.key_passes)),
                    player_name: player.player_name,
                    team: player.team
                }
                return {
                    ...stats,
                    xGA: round(stats.xG + stats.xA, 2)
                }
            } else {
                return {
                    id: player.player_name,
                    player_name: player.player_name,
                    team: player.team
                }
            }
        })
        console.timeEnd("aggregation")
        console.log(aggregatedData)

        setPlayersMatches(aggregatedData)
    }, [numberOfGames, playersData])

    const handleSelectChange = event => {
        console.log(event)
        setNumberOfGames(event.target.value)
    }

    // const onPlayerSearch = (event) => {
    //     const query = event.target.value
    //     console.log(query)
    //     setQuery(query)
    // }

    const filterPlayers = (players, query) => {
        return players.filter(player => {
            return player['player_name'].toLowerCase().includes(query.toLowerCase())
        })
    }

    const menuItems = range(1, 11, 1).map(i => <MenuItem key={i} value={i}>{i}</MenuItem>);

    return (
        <>
            <h1 style={{color: COLOR_TEXT_WHITE}}>Aggregated player stats across matches</h1>
            <p style={{color: COLOR_TEXT_WHITE}}>Use dropdown to select the number of previous matches for stats aggregation</p>
            <Select
                classes={{root: classes.select}}
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={numberOfGames}
                InputProps={{
                    className: classes.select
                }}
                onChange={event => handleSelectChange(event)}
            >
                {menuItems}
            </Select>
            <FormHelperText
                classes={{root: classes.helperText}}
            >
                Aggregate last x matches
            </FormHelperText>
            <ContainerDiv>
                {/*<TextField*/}
                {/*    className={classes.label}*/}
                {/*    onChange={onPlayerSearch}*/}
                {/*    id="standard-search"*/}
                {/*    label="Player search"*/}
                {/*    type="search"*/}
                {/*    InputProps={{*/}
                {/*        className: classes.input*/}
                {/*    }}*/}
                {/*/>*/}
                <DataTable
                    data={playersMatches}
                    colHeaders={columns}
                    onRowSelected={onRowSelected}
                    checkboxSelection={true}
                />
            </ContainerDiv>
        </>
    )
}

export default AggregatedMatchStatsTable;