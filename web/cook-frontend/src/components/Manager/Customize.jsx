import React from "react";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import https from 'https';
import axios from 'axios';

/*this is the customize component for the manager
view. The customization info is prefilled from the pull from
the database made on Manager. Each field has an eit button
which when clicked changes the 'sectionEdit' state to that section.
renderInfo is called which either creates a form to edit for the
section or renders what is there from the database.*/
class Customize extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            customizeInfo: [],
            sectionEdit: "",
            font:"",
            primary: "",
            secondary: "",
            tertiary:""
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange = (e) => {
        /*
          On change of the edit field- update the field in the
          state so we can send it to the database.
        */
        this.setState({ [e.target.name]: e.target.value });
      }

  /* Used for connecting to Menu in database */
  handleSubmit(event) {
  
    this.editForm("");
    event.preventDefault();
    
    /*https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples is where I'm pulling this formatting from.*/
    
    axios({
      method: 'post',
      url: process.env.REACT_APP_DB + '/restaurant/123',
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
    })
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
                            <p style={{margin: "0", padding: "0.3em"}}>{this.state.customizeInfo[5][1] + " "}
                                <button  onClick={() => this.editForm("Font") } className="btn btn-outline-dark btn-sm float-right"> <i className='fas fa-edit'></i> </button> 
                            </p>
                            :   
                            <form onSubmit = {this.handleSubmit}>
                            {/* if Font is the section to edit create a form and on submit send to the database*/}
                                    <input  className="form-control" type="text" name = "font" defaultValue={this.state.customizeInfo[5][1]} onChange={this.onChange}></input>
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