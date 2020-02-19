import React from "react";

function Header() {
    // This could be put in a CSS file
    const style = {
        backgroundColor: "#20232a",
        color: "white",
        fontSize: "2em",
    };

    return <header style={style}>Auto-Garcon</header>;
}

export default Header;