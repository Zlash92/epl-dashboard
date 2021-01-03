import React from 'react';
import {DataGrid} from '@material-ui/data-grid';
import styled from "@emotion/styled";
import {css} from "@emotion/core";
import {makeStyles} from "@material-ui/core/styles";
import {COLOR_TEXT_WHITE} from "./Colors";

const TableContainer = styled.div`
    height: 50em;
    width: 87em;
`


const useStyles = makeStyles({
    cell: {
        color: COLOR_TEXT_WHITE,
        backgroundColor: '#424242',
    },

})

const DataTable = ({ data, colHeaders, onCellClick }) => {
    const classes = useStyles();

    const handleSelectionChange = selectedRows => {
        console.log(selectedRows)
    }

    return (
        <TableContainer>
            <DataGrid
                className={classes.cell}
                rows={data}
                columns={colHeaders}
                pageSize={10}
                checkboxSelection
                onCellClick={onCellClick}
            />
        </TableContainer>
    );
}

export default DataTable;

