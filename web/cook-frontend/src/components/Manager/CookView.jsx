import React from "react";
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import CSignUp from './CSignUp';
import {Redirect} from "react-router-dom";

class CookView extends React.Component{
	constructor(props) {
      super(props);
      this.state = {
      	section:""
      };

      this.viewCategory = this.viewCategory.bind(this);
    }

	viewCategory = (category) => {
		//change view category
		this.setState({
        section: category
    })
	}
  renderInfo(){
    return(
      <React.Fragment>
          <Card className="text-center m-2 w-100" style={itemStyle}>
            {this.state.section !== "cook" ? 
                <button  onClick={() => this.viewCategory("cook") } className="btn btn-outline-dark btn-lg "> 
                  <Card.Header>
                    Cook View
                  </Card.Header>
                </button> 
                :   
                <Redirect to='/cook'/>
            }     
          </Card>
          <Card className="text-center m-2 w-100" style={itemStyle}>
            {this.state.section !== "acct" ? 
                <button  onClick={() => this.viewCategory("acct") } className="btn btn-outline-dark btn-lg "> 
                  <Card.Header>
                    Create New Staff Account
                  </Card.Header>
                </button> 

                :   
                <div className= "m-3">
                  <CSignUp/>
                </div>
            }     
          </Card>
      </React.Fragment>
      );
  }
	render(){
      return (
        <Container>
                <Container fluid style={{'minHeight': '70vh'}}>
                    <div className="d-flex flex-wrap">
                        {this.renderInfo()}
                    </div>
                </Container>
        </Container>
    
    );

	}
}
const itemStyle = {
    'borderBottom': 'grey solid 1px',
    'width':'200px'
};

export default CookView;