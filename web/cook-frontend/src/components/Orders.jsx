import React from "react";
import Order from "./Order";
import Container from 'react-bootstrap/Container';

class Orders extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            orders: [
                {table: 1, items: [{quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}]},
                {table: 2, items: [{quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}]},
                {table: 3, items: [{quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}]},
                {table: 4, items: [{quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}]},
                {table: 4, items: [{quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}]}
            ]
        };
    }

    renderOrders(){
        return this.state.orders.map((item, key) =>
            <Order key={key} id={key} order={item}/>
        );
    }

    render() {
        return (
            // <Order order={{table: 1}} />
            <Container fluid>
                <div style={ordersStyle}>
                    {this.renderOrders()}
                </div>
            </Container>
        )
    }
}

const ordersStyle = {
    display: "flex",
    fontSize: "1.2em",
    justifyContent: "space-between",
    margin: "30px",
    marginTop: "0",
    flexWrap: "wrap"
};

export default Orders;
