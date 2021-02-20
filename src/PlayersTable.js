import DataTable from "./Table";
import React, {useEffect, useState} from "react";
import styled from "@emotion/styled";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import {getPlayers} from "./api/api";
import {Modal} from "@material-ui/core";
import PlayerDetails from "./PlayerDetails";
import {COLOR_TEXT_WHITE} from "./Colors";

const tableCellWidth = 100
const commonColFields = {headerAlign: 'center', align: 'left'}

const columns = [
    {...commonColFields, field: 'player_name', headerName: 'Name', width: 200},
    {...commonColFields, field: 'team', headerName: 'Team', width: 150},
    {...commonColFields, field: 'appearances', headerName: 'Apps', width: tableCellWidth},
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
  //min-height: 100vh;
  margin-bottom: 20px;
  background-color: #282c34;
  display: flex;
  flex-direction: column
`

const useStyles = makeStyles({
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


const PlayersTable = ({ playersData = [] }) => {
    console.log(playersData)
    const [query, setQuery] = useState("")
    const [openModal, setOpenModal] = useState(false)
    const [modalData, setModalData] = useState(null)

    const classes = useStyles()

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

    const handlePlayerCellClick = cell => {
        setOpenModal(true)

        setModalData(cell.data)

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
            <DataTable
                data={filterPlayers(playersData, query)}
                colHeaders={columns}
                onCellClick={cell => handlePlayerCellClick(cell)}
            />
            <Modal
                className={classes.modal}
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div>
                    <PlayerDetails data={modalData}/>
                </div>
            </Modal>
        </ContainerDiv>
    )
}

export default PlayersTable;