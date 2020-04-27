import React from "react";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';

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
          name:this.props.info.name,
          address: this.props.info.address,
          phone: this.props.info.phone,
          open:this.props.info.opening,
          close:this.props.info.closing,
          restaurant_id :cookies.get("mystaff").restaurant_id,
          token:cookies.get('mytoken')
        };

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShow = this.handleShow.bind(this);

  }

  onChange = (e) => {
    /*
      Because we named the inputs to match their
      corresponding values in state, it's
      super easy to update the state
    */
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state);
  }

  /* Used for connecting to Customization in database */
  handleSubmit(event) {
    console.log(this.state);
    this.editForm("");
    event.preventDefault();
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
  })
}

change(event){
  this.setState({value: event.target.value});
}

renderInfo(){
    return (
        <React.Fragment>
            <Card className="text-center m-2 w-100" style={itemStyle}>
                <Card.Header style={cardHeaderStyle}>Font 
                </Card.Header>
                    <Card.Body>
                        {/* if Font is not the section to edit render the database info and a button to edit*/}
                        {this.state.sectionEdit !== "Font" ? 

                            <p style={{margin: "0", padding: "0.3em"}}>{this.state.customizeInfo[5][1] + ""}
                            
                                <button  onClick={() => this.editForm("Font") } className="btn btn-outline-dark btn-sm float-right"> <i className='fas fa-edit'></i> </button> 
                            </p>
                            :   
                            <form onSubmit = {this.handleSubmit}>
                            {/* if Font is the section to edit create a form and on submit send to the database*/}
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
                                </form>
                        }
                    </Card.Body>
            </Card>
            <Card className="text-center m-2 w-100" style={itemStyle}>
                <Card.Header style={cardHeaderStyle}>Colors</Card.Header>
                <Card.Body>
                    <div className = "border-bottom m-3">
                        <h5 className="card-subtitle mb-2 text-muted float-left">Primary</h5>
                         {this.state.sectionEdit !== "Primary" ? 
                                <p style={{margin: "0", padding: "0.8em"}}>{this.state.customizeInfo[6][1]}
                                    <button onClick={() => this.editForm("Primary") } className="btn btn-outline-dark btn-sm float-right"> <i className='fas fa-edit'></i> </button>
                                </p>
                                :  <form onSubmit = {this.handleSubmit}>
                                    <input  className="form-control" type="text" name = "font" defaultValue={this.state.customizeInfo[6][1]} onChange={this.onChange}></input>
                                    <div className="row m-2">
                                        <button  className="btn btn-primary" style = {{backgroundColor: '#0B658A', border: '#0B658A'}}>Submit</button>
                                    </div>
                                </form>
                            }
                    </div>
                    <div className = "border-bottom m-3">
                        <h5 className="card-subtitle mb-2 text-muted float-left">Secondary</h5>
                            {this.state.sectionEdit !== "Secondary" ? 
                                <p style={{margin: "0", padding: "0.8em"}}>{this.state.customizeInfo[7][1]}
                                    <button onClick={() => this.editForm("Secondary") } className="btn btn-outline-dark btn-sm float-right"> <i className='fas fa-edit'></i> </button>
                                </p>
                                : <form onSubmit = {this.handleSubmit}>
                                    <input  className="form-control" type="text" name = "font" defaultValue={this.state.customizeInfo[7][1]} onChange={this.onChange}></input>
                                    <div className="row m-2">
                                        <button  className="btn btn-primary" style = {{backgroundColor: '#0B658A', border: '#0B658A'}}>Submit</button>
                                    </div>
                                </form>
                            }
                    </div>
                    <div className = "border-bottom m-3">
                    <h5 className="card-subtitle mb-2 text-muted float-left">Tertiary</h5>
                        {this.state.sectionEdit !== "Tertiary" ? 
                            <p style={{margin: "0", padding: "0.8em"}}>{this.state.customizeInfo[8][1]}
                                <button  onClick={() => this.editForm("Tertiary") } className="btn btn-outline-dark btn-sm float-right"> <i className='fas fa-edit'></i> </button>
                            </p>
                            : <form onSubmit = {this.handleSubmit}>
                                    <input  className="form-control" type="text" name = "font" defaultValue={this.state.customizeInfo[8][1]} onChange={this.onChange}></input>
                                    <div className="row m-2">
                                        <button  className="btn btn-primary" style = {{backgroundColor: '#0B658A', border: '#0B658A'}}>Submit</button>
                                    </div>
                                </form>
                        }
                    </div> 
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
    'fontFamily': 'Kefa',
    'textAlign':'left',
    'height': '45px'
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
export default Customize;
