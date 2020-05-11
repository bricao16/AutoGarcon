import React from "react";
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import {Redirect} from "react-router-dom";
import CSignUp from './CSignUp';
import CookViewImg from '../../../assets/cookview.png';
import Cook from '../../Cook/Cook'
/*
this view in the manager page allows a manager
to either
1. view the current orders on the "cook view" by
redirecting to the cook page 
2. create a new cook account
*/
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
    //get the styles
    const primary = this.props.primary;
    const secondary = this.props.secondary;
    const teritary = this.props.teritary;
    const font = this.props.font;
    const font_color = this.props.font_color
    return(
      //render the two buttons to either go to cook view or sign up
      <React.Fragment>
          <Card className="text-center w-50" style={itemStyle}>
            {this.state.section !== "cook" ? 
                <button  onClick={() => this.viewCategory("cook") } className="btn btn-dark btn-lg "> 
                  <Card.Header style ={{'fontFamily' :font, 'backgroundColor': primary, 'color': font_color,'paddingTop':'8px','height':'54px'}}>
                    Go to cook view
                  </Card.Header>
                  <Card.Body >
                    <img src = {CookViewImg} width = {'100%'}/>
                  </Card.Body>
                </button> 
                :   
                <Redirect to='/cook'/>
            }     
          </Card>
          <Card className="text-center m-2 w-50" style={itemStyle}>
            {this.state.section !== "acct" ? 
                <button  onClick={() => this.viewCategory("acct") } className="btn-dark  btn-lg"> 
                  <Card.Header style ={{'fontFamily' :font, 'backgroundColor': primary, 'color': font_color,'paddingTop':'8px','height':'54px'}}>
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
      //put all things rendered into container for the manager page
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
};

export default CookView;