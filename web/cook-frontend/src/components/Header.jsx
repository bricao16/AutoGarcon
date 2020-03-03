import React from "react";
import logoImage from "../assets/AG2.png"

function Header() {
    // This could be put in a CSS file
    const style = {
        display: "flex",
        fontSize: "2em",
        borderBottom: "solid #1022644 2px",
        padding: "5px 0 5px 10px",
        alignItems: "center",
        fontWeight: "300"
    };

    return (
        <header style={style}>
            <img src={logoImage} width="auto" height="150vw" alt="Auto-Garcon" />
            {/*<p style={{margin: 0, marginLeft: "10px"}}>Auto-Garcon</p>*/}
        </header>
    );
}

export default Header;