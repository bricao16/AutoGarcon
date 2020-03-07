import React from "react";
//import Order from "./Order";
import Container from 'react-bootstrap/Container';
import HoursProp from './HoursProp';
import Col from 'react-bootstrap/Col';


class MHours extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            hours: [
                {type: "Weekday", items: [{open: "7:00 am", close: "10:00 pm"}]}
            ],
        };
    }
    renderHours(){
        return this.state.hours.map((item, key) =>
            <HoursProp key={key} id={key} hoursType={item}/>
        );
    }
    render() {
        return (
            <Container>
              <div style={backgroundStyle}>
             <Container fluid>
                <Col className="pt-3 px-3">
                        <Container fluid>
                            <div style={managerStyle}>
                                {this.renderHours()}
                            </div>
                        </Container>
                    </Col>
            </Container> 
        </div>
    </Container>
        );
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
var backgroundStyle = {
  'background-color': '#f1f1f1'
}

export default MHours;