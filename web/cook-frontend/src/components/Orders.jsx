import React from "react";

function Order(props) {
    return (
        <div style={orderStyle}>
            Table: {props.order.table}
            <hr/>
            {
                props.order.items.map((item, key) =>
                    <p>{item}</p>
                )
            }
        </div>
    )
}

const orderStyle = {
    border: "1px solid #20232a",
    margin: "20px 0 0 20px",
    padding: "5px"
};

class Orders extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            orders: [
                {table: 1, items: ["Hamburger", "French Fries", "Cherry Coke"]},
                {table: 2, items: ["Steak", "2x Eggs", "Bread"]},
                {table: 3, items: ["Ice Cream", "Milkshake"]},
                {table: 4, items: ["Hamburger", "French Fries", "Cherry Coke"]}
            ]
        };
    }

    renderOrders(){
        return this.state.orders.map((item, key) =>
            <Order key={key} order={item}/>
        );
    }

    render() {
        return (
            // <Order order={{table: 1}} />
            <div style={ordersStyle}>
                {this.renderOrders()}
            </div>
        )
    }
}

const ordersStyle = {
    display: "flex",
    fontSize: "1.2em"
};

export default Orders;
