import React from "react";
import Container from 'react-bootstrap/Container';
import CustomizeProp from './CustomizeProp';
import Card from 'react-bootstrap/Card';

/*this is the customize component for the manager
view. The stats are stored in state and rendered 
onto cards in by CustomizeProp */
class MCustomize extends React.Component{

    constructor(props) {
        
        super(props);
        this.state = {
            customizeInfo: []
        };
    }
    renderInfo(){
        return (
                <React.Fragment>
                    <Card className="text-center m-2" style={itemStyle}>
                        <Card.Header style={cardHeaderStyle}>Font 
                        </Card.Header>
                            <Card.Body>
                                {this.state.customizeInfo[5][1] ? 
                                    <p style={{margin: "0", padding: "0.8em"}}>{this.state.customizeInfo[5][1]}<br></br> <br></br> </p>
                                    : <p style={{margin: "0", padding: "0.8em"}}>Add Font<br></br> <br></br> </p>
                                }
                                <button className="btn btn-outline-dark btn-sm"> <i className='fas fa-edit'></i> </button>
                            </Card.Body>
                        
                    </Card>
                 
                    <Card className="text-center m-2" style={itemStyle}>
                        <Card.Header style={cardHeaderStyle}>Primary Color</Card.Header>
                        <Card.Body>
                             {this.state.customizeInfo[6][1] ? 
                                    <p style={{margin: "0", padding: "0.8em"}}>{this.state.customizeInfo[6][1]}<br></br> <br></br> </p>
                                    : <p style={{margin: "0", padding: "0.8em"}}>Add Primary Color<br></br> <br></br> </p>
                                }
                            <button className="btn btn-outline-dark btn-sm"> <i className='fas fa-edit'></i> </button>
                        </Card.Body>
                    </Card>
                    <Card className="text-center m-2" style={itemStyle}>
                        <Card.Header style={cardHeaderStyle}>Secondary Color</Card.Header>
                        <Card.Body>
                                {this.state.customizeInfo[7][1] ? 
                                    <p style={{margin: "0", padding: "0.8em"}}>{this.state.customizeInfo[7][1]}<br></br> <br></br> </p>
                                    : <p style={{margin: "0", padding: "0.8em"}}>Add Secondary Color<br></br> <br></br> </p>
                                }
                            <button className="btn btn-outline-dark btn-sm"> <i className='fas fa-edit'></i> </button>
                        </Card.Body>
                    </Card>
                    <Card className="text-center m-2" style={itemStyle}>
                        <Card.Header style={cardHeaderStyle}>Tertiary Color</Card.Header>
                        <Card.Body>
                                {this.state.customizeInfo[8][1] ? 
                                    <p style={{margin: "0", padding: "0.8em"}}>{this.state.customizeInfo[8][1]}<br></br> <br></br> </p>
                                    : <p style={{margin: "0", padding: "0.8em"}}>Add Tertiary Color<br></br> <br></br> </p>
                                }
                            <button className="btn btn-outline-dark btn-sm"> <i className='fas fa-edit'></i> </button>
                        </Card.Body>
                    </Card>
                </React.Fragment>

            )

    }
    render() {
        const {customizeInfo } = this.state;
        const resturantInfo = this.props.info;
        //put resturant info into an array
        Object.keys(resturantInfo).forEach(function(key) {
            customizeInfo.push([key ,resturantInfo[key]]);
        });
        console.log(customizeInfo)
        return (
            <Container>
                <div style={backgroundStyle}>
                <h2 style={mainMenuHeaderStyle}>
                  Customize
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
export default MCustomize;