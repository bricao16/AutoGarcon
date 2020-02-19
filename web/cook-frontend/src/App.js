import React from 'react';
import logo from './logo.svg';
import './App.css';

// Declaring components in App.js for now instead of having them in separate files

function Header() {
    // This could be put in a CSS file
    const style = {
        backgroundColor: "#20232a",
        color: "white",
        fontSize: "2em",
    };

    return (
        <header style={style}>Auto-Garcon</header>
    );
}

function Order(props) {

    const style = {
        border: "1px solid #20232a",
        margin: "20px 0 0 20px",
        padding: "5px"
    };

    return (
        <div style={style}>
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
        this.style = {
            display: "flex",
            fontSize: "1.2em"
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
            <div style={this.style}>
                {this.renderOrders()}
            </div>
        )
    }
}

function App() {
    return (
        <div className="App">
            {/*
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
            */}
            <Header/>
            <Orders/>
        </div>
    );
}

export default App;
