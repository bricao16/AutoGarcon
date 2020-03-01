import React from "react";
import logoImage from "../assets/logo.png"

function MHeader() {
    // This could be put in a CSS file
    const style = {
        display: "flex",
        fontSize: "2em",
        borderBottom: "solid grey 2px",
        padding: "5px 0 5px 10px",
        alignItems: "center",
        fontWeight: "300"
    };

    return (
        <header style={style}>
            <img src={logoImage} width="auto" height="35px" alt="waiter" />
            <p style={{margin: 0, marginLeft: "10px"}}>Auto-Garcon </p>
            <p style={{margin: 0, marginLeft: "60vw"}}> <i> Manager View</i></p>
        </header>
    );
}

export default MHeader;