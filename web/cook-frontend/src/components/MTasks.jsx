import React from "react";
//import Order from "./Order";
import Container from 'react-bootstrap/Container';
import Menu from './Menu';
import Stats from './MStats';
import Hours from './MHours';
class MTasks extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            menu: [
                {type: "Breakfast", items: [{item: "Toast"}, {item: "Eggs"}, {item: "Bacon"}]},
                {type: "Lunch",items: [{item: "Hamburger"}, {item: "Fries"}, {item: "Salad"}]},
                {type: "Dinner",items: [{item: "Pasta"}, {item: "Chicken"}, {item: "Sandwich"}]}
            ],
            hours: [
                {type: "Weekday", items: [{open: "7:00 am", close: "10:00 pm"}]}
            ],
            statistics: [
                {type: "Highest Selling Breakfast", items: [{quantity: 50, title: "Eggs"}]},
                {type: "Highest Selling Lunch", items: [{quantity: 75, title: "Fries"}]},
                {type: "Highest Selling Dinner", items: [{quantity: 150, title: "Pasta"}]}
                ]
        };
    }

    renderMenu(){
        return this.state.menu.map((item, key) =>
            <Menu key={key} id={key} menuItem={item}/> 
        );
     
    }
    renderStats(){
        return this.state.statistics.map((item, key) =>
            <Stats key={key} id={key} statsType={item}/>
        );
    }
    renderHours(){
        return this.state.hours.map((item, key) =>
            <Hours key={key} id={key} hoursType={item}/>
        );
    }

    render() {
        return (

            <Container fluid>
                <div style={managerStyle}>
                    {this.renderMenu()}
                    {this.renderStats()}
                    {this.renderHours()}
                </div>
            </Container>
        )
    }
}

const managerStyle = {
    display: "flex",
    fontSize: "1.2em",
    justifyContent: "space-between",
    margin: "30px",
    marginTop: "0",
    flexWrap: "wrap"
};

export default MTasks;
