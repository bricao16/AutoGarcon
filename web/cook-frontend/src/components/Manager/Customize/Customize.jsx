import React from "react";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';
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
          fonts: [ 'Arial', 'Roboto','Times New Roman', 'Courier New', 'Courier', 'Verdana'],
          sectionEdit: "",
          show:false,
          font: this.props.info.font,
          primary: this.props.info.primary_color ,
          secondary: this.props.info.secondary_color,
          tertiary: this.props.info.tertiary_color,
          temp_primary: this.props.info.primary_color,
          temp_secondary: this.props.info.secondary_color,
          temp_tertiary:this.props.info.tertiary_color,
          restaurant_id :cookies.get("mystaff").restaurant_id,
          token:cookies.get('mytoken')
        };

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShow = this.handleShow.bind(this);

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


  /* Used for connecting to Customization in database */
  handleSubmit(event) {
    console.log(this.state);
    this.editForm("");

    //event.preventDefault();
    
    /*https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples is where I'm pulling this formatting from.*/

    axios({
      method: 'POST',
      url:  process.env.REACT_APP_DB +'/restaurant/update/',
      data: 'restaurant_id='+this.state.restaurant_id+'&name='+this.state.name+
      '&address='+this.state.address+'&phone='+this.state.phone+
      '&opening='+this.state.open+'&closing='+this.state.close,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + this.state.token
      },
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false,
      }),
    })
    .then(async response => {
      await response;

      if (response.status !== 200) {this.handleShow(false);}
      else {this.handleShow(true, "changed");}
    })
    .catch(error => {
      this.handleShow(false);
      console.error("There was an error!", error);
    });


}

  /* Used to show the correct alert after hitting save item */
  handleShow(success, message) {
    if (success) {
      this.setState({response: "Successfully "+message+"!"});
      this.setState({alertVariant: 'success'});
    }
    else {
      this.setState({response: 'Failed to update'})
      this.setState({alertVariant: 'danger'});
    }

    this.setState({show: true});
  }

//change the category of which is being edited
editForm = (category) => {
    this.setState({
      sectionEdit: category
  });
}

change(event){
  this.setState({value: event.target.value});
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
                          <p style={{margin: "0", padding: "0.8em"}}>{this.state.customizeInfo[5][1]}</p>
                            :   
                            <form class="form-inline">
                            {/* choose font and submit to change font */}
                            <div style= {{float: 'left'}}>
                                <select id="lang" onChange={this.change.bind(this)} value={this.state.value}>
                                    {/* <option value="Selected">{this.state.customizeInfo[5][1]}</option> */}
                                    
                                    {/* dropdown menu options */}
                                    <option value="Arial">{this.state.fonts[0]}</option>
                                    <option value="Roboto">{this.state.fonts[1]}</option>
                                    <option value="Times New Roman">{this.state.fonts[2]}</option>
                                    <option value="Courier New">{this.state.fonts[3]}</option>
                                    <option value="Courier">{this.state.fonts[4]}</option>
                                    <option value="Verdana">{this.state.fonts[5]}</option>

                                </select>
                                 
                                
                            </div>
                            <br></br>
                            <div className="row m-2">
                                        <button  className="btn btn-primary" style = {{backgroundColor: '#0B658A', border: '#0B658A'}}>Submit</button>
                            </div>
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
  'backgroundColor': '#f1f1f1',
  'minWidth': '70vw'
}

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
export default Customize;