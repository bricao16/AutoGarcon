import React from "react";

function Order(props) {
    return (
        <div style={orderStyle}>
            <div style={topStyle}>
                <p style={{margin: "0", padding: "5px"}}>{props.id}</p>
            </div>
            {
                props.order.items.map((item, key) => (
                    <div style={itemStyle}>
                        <p style={{margin: "0", padding: "0.8em"}}>{item.quantity}x</p>
                        <p style={{margin: "0", padding: "0.8em"}}>{item.title}</p>
                    </div>
                ))
            }
        </div>
    )
}

const orderStyle = {
    width: "20vw",
    border: "grey solid 1px",
    borderRadius: "5px",
    marginTop: "30px"
};

const topStyle = {
    background: "#20639B",
    color: "white"
};

const itemStyle = {
    display: "flex",
    borderBottom: "grey solid 1px",
};

export default Order;