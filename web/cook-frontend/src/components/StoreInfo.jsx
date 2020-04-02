import React from "react";
import Container from 'react-bootstrap/Container';

import Card from 'react-bootstrap/Card';

/* This component is used to render the 
resturant information for the manager view.
The resturant information is being called from the database in the
MTasks and being passed down store info. The information for a store 
is stored under the title "info" coming in from the props. This is a 3d
array, the first element has resturant information, and the second element of
that contains the actual information. So this.props.info[0][1].

This is mapped to an array and then rendered into cards. The cards are manually
created rather than dynamically in aother component because under this section
each of these cards MUST have all this information. */

class StoreInfo extends React.Component{

    constructor(props) {
        
        super(props);
        this.state = {
            restaurantInfo: []
        };
    }
    renderInfo(){
        return (
                <React.Fragment>
                    <Card className="text-center m-2" style={itemStyle}>
                        <Card.Header style={cardHeaderStyle}>Name 
                        </Card.Header>
                            <Card.Body>
                                {this.state.restaurantInfo[0][1] ? 
                                    <p style={{margin: "0", padding: "0.8em"}}>{this.state.restaurantInfo[0][1]}<br></br> <br></br> </p>
                                    : <p style={{margin: "0", padding: "0.8em"}}>Add Restaurant Name<br></br> <br></br> </p>
                                }
                                <button className="btn btn-outline-dark btn-sm"> <i className='fas fa-edit'></i> </button>
                            </Card.Body>
                        
                    </Card>
                 
                    <Card className="text-center m-2" style={itemStyle}>
                        <Card.Header style={cardHeaderStyle}>Address</Card.Header>
                        <Card.Body>
                             {this.state.restaurantInfo[1][1] ? 
                                    <p style={{margin: "0", padding: "0.8em"}}>{this.state.restaurantInfo[1][1]}<br></br> <br></br> </p>
                                    : <p style={{margin: "0", padding: "0.8em"}}>Add Address<br></br> <br></br> </p>
                                }
                            <button className="btn btn-outline-dark btn-sm"> <i className='fas fa-edit'></i> </button>
                        </Card.Body>
                    </Card>
                    <Card className="text-center m-2" style={itemStyle}>
                        <Card.Header style={cardHeaderStyle}>Phone Number</Card.Header>
                        <Card.Body>
                                {this.state.restaurantInfo[2][1] ? 
                                    <p style={{margin: "0", padding: "0.8em"}}>{this.state.restaurantInfo[2][1]}<br></br> <br></br> </p>
                                    : <p style={{margin: "0", padding: "0.8em"}}>Add Phone Number<br></br> <br></br> </p>
                                }
                            <button className="btn btn-outline-dark btn-sm"> <i className='fas fa-edit'></i> </button>
                        </Card.Body>
                    </Card>
                    <Card className="text-center m-2" style={itemStyle}>
                        <Card.Header style={cardHeaderStyle}>Opening</Card.Header>
                        <Card.Body>
                                {this.state.restaurantInfo[3][1] ? 
                                    <p style={{margin: "0", padding: "0.8em"}}>{this.state.restaurantInfo[3][1]}<br></br> <br></br> </p>
                                    : <p style={{margin: "0", padding: "0.8em"}}>Add Opening Time<br></br> <br></br> </p>
                                }
                            <button className="btn btn-outline-dark btn-sm"> <i className='fas fa-edit'></i> </button>
                        </Card.Body>
                    </Card>
                    <Card className="text-center m-2" style={itemStyle}>
                        <Card.Header style={cardHeaderStyle}>Closing</Card.Header>
                        <Card.Body>
                                {this.state.restaurantInfo[4][1] ? 
                                    <p style={{margin: "0", padding: "0.8em"}}>{this.state.restaurantInfo[4][1]}<br></br> <br></br> </p>
                                    : <p style={{margin: "0", padding: "0.8em"}}>Add Closing Time<br></br> <br></br> </p>
                                }
                            <button className="btn btn-outline-dark btn-sm"> <i className='fas fa-edit'></i> </button>
                        </Card.Body>
                    </Card>
                </React.Fragment>

            )

    }
    render() {
        const {restaurantInfo } = this.state;
        const fullResturantInfo = this.props;
        //put resturant info into an array
        Object.keys(fullResturantInfo.info).forEach(function(key) {
            restaurantInfo.push([key ,fullResturantInfo.info[key]]);
        });
        return (
            <Container>
                <div style={backgroundStyle}>
                <h2 style={mainMenuHeaderStyle}>
                  Restaurant Information
                </h2>
                    <Container fluid style={{'minHeight': '70vh'}}>
                        <div className="d-flex flex-wrap">
                            {this.renderInfo()}
                        </div>
                    </Container>
                </div>
            </Container>
        );
    }
}

const backgroundStyle = {
  'backgroundColor': '#f1f1f1'
}

const cardHeaderStyle = {
    'backgroundColor': '#0b658a',
    'color': '#ffffff',
    'fontFamily': 'Kefa'
};
const itemStyle = {
    'borderBottom': 'grey solid 1px',
    'width':'200px'
};
const mainMenuHeaderStyle = {
  'backgroundColor': '#102644',
  'color': '#ffffff',
  'fontFamily': 'Kefa',
  'textAlign' : 'center',
  'height':'54px',
  'paddingTop':'8px'
}
export default StoreInfo;