import logo from './logo.svg';
import './App.css';
import DataTable from "./Table";
import React, {useEffect, useRef, useState} from "react";
import styled from "@emotion/styled";
import TextField from "@material-ui/core/TextField";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import PlayersTable from "./PlayersTable";
import {COLOR_BACKGROUND_DARK_BLUE} from "./Colors";

const WrapperDiv = styled.div`
    display: flex;
    background-color: ${COLOR_BACKGROUND_DARK_BLUE};
    justify-content: center;
`

const App = () => {
    return (
        <WrapperDiv>
            <PlayersTable />
        </WrapperDiv>
    );
}

export default App;
