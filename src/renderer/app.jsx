import React from "react";
import {render} from "react-dom";
import KeywordMemo from "./KeywordMemo";

var appStyle = {
    width: '100%',
    height: '100%'
};

render(
    <div style={appStyle}>
        <KeywordMemo/>
    </div>
    , document.getElementById("app"));