import React from 'react';
import {DataGrid} from '@material-ui/data-grid';
import styled from "@emotion/styled";
import {css} from "@emotion/core";
import {makeStyles} from "@material-ui/core/styles";

const TableContainer = styled.div`
    height: 50em;
    width: 87em;
`


const useStyles = makeStyles({
    cell: {
        color: '#fbfbfb',
        backgroundColor: '#424242',
    },

})

const DataTable = ({ data, colHeaders }) => {
    const classes = useStyles();
    return (
        <TableContainer>
            <DataGrid className={classes.cell} rows={data} columns={colHeaders} pageSize={10} checkboxSelection/>
        </TableContainer>
    );
}

export default DataTable;

