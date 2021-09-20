import React from 'react';
import {DataGrid, GridToolbar} from '@material-ui/data-grid';
import styled from "@emotion/styled";
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

const DataTable = ({ data, colHeaders, onCellClick, onRowSelected, onSelectionModelChange, checkboxSelection }) => {
    const classes = useStyles();

    return (
        <TableContainer>
            <DataGrid
                className={classes.cell}
                rows={data}
                columns={colHeaders.map((column) => ({
                    ...column,
                    // disableClickEventBubbling: true,  // TODO: What is this?
                }))}
                pageSize={10}
                checkboxSelection={checkboxSelection}
                onCellClick={onCellClick}
                onRowSelected={onRowSelected}
                onSelectionModelChange={onSelectionModelChange}
                components={{
                    Toolbar: GridToolbar,
                }}
            />
        </TableContainer>
    );
}

export default DataTable;

