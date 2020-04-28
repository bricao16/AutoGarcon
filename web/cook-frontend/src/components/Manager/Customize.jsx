import React from "react";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Dropdown from 'react-bootstrap/Dropdown';
import { ChromePicker } from 'react-color';

/*this is the customize component for the manager
view. The customization info is prefilled from the pull from
the database made on Manager. 

Each field has an edit button  when clicked changes 
the 'sectionEdit' state to that section.

renderInfo is called which either creates a form to edit for the
section or renders what is there from the database.*/

class Customize extends React.Component{
    constructor(props) {
      super(props);

      const cookies = new Cookies();
      this.state = {
        customizeInfo: [],
        sectionEdit: "",
        font:"",
        primary: this.props.info.primary_color,
        secondary: this.props.info.secondary_color,
        tertiary:this.props.info.tertiary_color,
        temp_primary: this.props.info.primary_color,
        temp_secondary: this.props.info.secondary_color,
        temp_tertiary:this.props.info.tertiary_color,
        staff: cookies.get("mystaff")
    };

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
    /*
      On change of the edit field- update the field in the
      state so we can send it to the database.
    */
  onChange = (e) => {
      console.log(e);
      if(this.state.sectionEdit ==="Primary")
      {  this.setState({ 'temp_primary':  e.hex});
      }
      else if(this.state.sectionEdit ==="Seconday")
      {
        this.setState({ 'temp_secondary':  e.hex});
      }
      else if(this.state.sectionEdit ==="Tertiary")
      {
        this.setState({ 'temp_tertiary':  e.hex});
      }
    }


  /* Used for connecting to Menu in database */
  handleSubmit(event) {
  
    this.editForm("");
    //event.preventDefault();
    
    /*https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples is where I'm pulling this formatting from.*/
    
    axios({
      method: 'post',
      url: process.env.REACT_APP_DB + '/restaurant/' +this.state.staff.resturant_id,
      data: 'name='+this.state.name+'&address='+this.state.address
      +'&phone='+this.state.phone+'&open='+this.state.open
      +'&close='+this.state.close,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false,
      }),
    })
    .then(async response => {
      const data = await response.json();
      
      if(!response.ok){
        alert('Sucessful sumbit');
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
      this.setState({redirect: true});
    
    })
    .catch(error =>{
        alert('Unsucessful sumbit');
      this.setState({redirect: false});
      console.error("There was an error!", error);
    });
}

//change the category of which is being edited
editForm = (category) => {
    this.setState({
      sectionEdit: category
  });
}
renderInfo(){
    return (
        <React.Fragment>
            <Card className="text-center m-2 w-50" style={itemStyle}>
                <Card.Header >Font 
                <button onClick={() => this.editForm("Font") } className="btn btn-outline-dark btn-sm float-right"> <i className='fas fa-edit'></i> </button>
                </Card.Header>
                    <Card.Body>
                        {/* if Font is not the section to edit render the database info and a button to edit*/}
                        {this.state.sectionEdit !== "Font" ?
                          <p style={{margin: "0", padding: "0.8em"}}>{this.state.customizeInfo[5][1]}
                             
                              </p>
                            :   
                            <form class="form-inline">
                            {/* if Font is the section to edit create a form and on submit send to the database*/}
                            <label class="my-1 mr-2" for="inlineFormCustomSelectPref">Font</label>
                            <select class="custom-select my-1 mr-sm-2" id="inlineFormCustomSelectPref">
                              <option value="1">Arial</option>
                              <option value="2">Times New Roman</option>
                              <option value="3">Calibri</option>
                            </select>
                            <button type="submit" class="btn btn-primary mr-3" >Submit</button>
                            <button onClick={() => this.editForm("")} type="button" class="btn btn-outline-danger ml-4" >Cancel</button>
                          </form>
                        }
                    </Card.Body>
            </Card>
            
                  <Card className="text-center m-2 w-10" style={itemStyle}>
                    <Card.Header>Primary
                      <button onClick={() => this.editForm("Primary") } className="btn btn-outline-dark btn-sm float-right"> <i className='fas fa-edit'></i> </button>
                    </Card.Header>
                    <Card.Body style={{backgroundColor:this.state.primary}}>
                      <div className = "col  m-3">
                        {this.state.sectionEdit !== "Primary" ? 
                            <p>{this.state.primary}</p>
                        :  <Container>
                                <ChromePicker
                                  color={ this.state.temp_primary }
                                  onChangeComplete={this.onChange }
                                />
                                <br/>
                              <button onClick={() => this.editForm("")} type="button" class="btn btn-outline-danger ml-4" >Cancel</button>
                              </Container>
                        }
                      </div>
                    </Card.Body>
                   </Card>
                  <Card className="text-center m-2 w-10" style={itemStyle}>
                    <Card.Header>Secondary
                      <button onClick={() => this.editForm("Secondary") } className="btn btn-outline-dark btn-sm float-right"> <i className='fas fa-edit'></i> </button>
                    </Card.Header>
                    <Card.Body style={{backgroundColor:this.state.secondary}}>
                      <div className = "col  m-3">
                        {this.state.sectionEdit !== "Secondary" ? 
                            <p>{this.state.secondary}</p>
                        :    
                              <Container>
                                <ChromePicker
                                  color={ this.state.temp_secondary}
                                  onChangeComplete={this.onChange }
                                />
                                <br/>
                              <button onClick={() => this.editForm("")} type="button" class="btn btn-outline-danger ml-4" >Cancel</button>
                              </Container>
                        }
                      </div>
                    </Card.Body>
                   </Card>
                   <Card className="text-center m-2 w-10" style={itemStyle}>
                    <Card.Header >Tertiary
                      <button  onClick={() => this.editForm("Tertiary") } className="btn btn-outline-dark btn-sm float-right"> <i className='fas fa-edit'></i> </button>
                    </Card.Header>
                    <Card.Body style={{backgroundColor:this.state.tertiary }}>
                      <div className = "p-3">
                        {this.state.sectionEdit !== "Tertiary" ? 
                            <p>{this.state.tertiary}  </p>
                             :
                              <Container>
                                <ChromePicker
                                  color={ this.state.temp_tertiary}
                                  onChangeComplete={this.onChange }
                                />
                                <br/>
                              <button onClick={() => this.editForm("")} type="button" class="btn btn-outline-danger ml-4" >Cancel</button>
                              </Container>
                        }
                    </div> 
                    </Card.Body>
                   </Card>'
   
        </React.Fragment>

        )

}
    render() {
        const {customizeInfo } = this.state;
        const resturantInfo = this.props.info;
        console.log(resturantInfo);
        //put resturant info into an array
        Object.keys(resturantInfo).forEach(function(key) {
            customizeInfo.push([key ,resturantInfo[key]]);
        });
        return (
            <Container>
                <div style={backgroundStyle}>
                <h2 style ={menuHeaderStyle}>
                  Customize
                </h2>
                    <Container fluid style={{'width': '70vw'}}>
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
    'fontFamily': 'Kefa',
    'textAlign':'left',
    'height': '45px'
};
const itemStyle = {
    'borderBottom': 'grey solid 1px',

};
const menuHeaderStyle = {
  'backgroundColor': '#102644',
  'color': '#ffffff',
  'fontFamily': 'Kefa',
  'textAlign' : 'center',
  'height':'54px'
};
const mainMenuHeaderStyle = {
  'backgroundColor': '#102644',
  'color': '#ffffff',
  'fontFamily': 'Kefa',
  'textAlign' : 'center',
  'height':'54px',
  'paddingTop':'8px'
}

const menuTextStyle = {
  'flex': '1',
  'paddingRight': '69px',
  'paddingTop': '8px'
};
export default Customize;