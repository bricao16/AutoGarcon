import React from "react";
import Container from 'react-bootstrap/Container';
import HoursProp from './HoursProp';

/* This component is used to render the 
resturant hours for the manager view.
the hours are held in a state array called
hours and passed to the HoursProp where the 
data is placed on cards. */

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
                        <div class="d-flex flex-wrap">
                            {this.renderHours()}
                        </div>
                    </Container>
                </div>
            </Container>
        );
    }
}

const backgroundStyle = {
  'background-color': '#f1f1f1'
}

export default MHours;