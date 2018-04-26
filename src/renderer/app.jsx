import React from "react";
import {render} from "react-dom";
import KeywordMemo from "./KeywordMemo";
import About from "./About";

var appStyle = {
    width: '100%',
    height: '100%'
};

render(
    <div style={appStyle}>
        <KeywordMemo/>
        <About/>
    </div>
    , document.getElementById("app"));