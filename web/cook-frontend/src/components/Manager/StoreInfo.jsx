import React from "react";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';

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
    
    const cookies = new Cookies();
    this.state = {
      restaurantInfo: [],
      sectionEdit: "",
      name:"",
      address: "",
      phone: "",
      open:"",
      close:"",
      restaurant_id :cookies.get("mystaff").restaurant_id,
      token: cookies.get("token")
    };

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
  /* Used for connecting to Menu in database */
  handleSubmit(event) {
    this.editForm("");
    event.preventDefault();
    axios({
      method: 'post',
      url:  process.env.REACT_APP_DB +'/restaurant/update' + this.state.restaurant_id,
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
        alert('Successful submit');
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
      this.setState({redirect: true});
    
    })
    .catch(error =>{
        alert('Unsuccessful submit');
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
        <Card className="text-center m-2 w-100" style={itemStyle}>
          <Card.Header style={cardHeaderStyle}>General</Card.Header>
          <Card.Body>
              <div className = "border-bottom m-3">
                  {/*If edit was clicked on this part open form otherwise render just the name */}
                  <h5 className="card-subtitle mb-2 text-muted float-left">Restaurant Name</h5>
                   {this.state.sectionEdit !== "Name" ? 
                          <p style={{margin: "0", padding: "0.8em"}}>{this.state.restaurantInfo[0][1]}
                              <button  onClick={() => this.editForm("Name") } className="btn btn-outline-dark btn-sm float-right"> <i className='fas fa-edit'></i> </button>
                          </p>
                          : 
                            <form onSubmit = {this.handleSubmit}>
                                  <input  className="form-control" type="text" name = "name" defaultValue={this.state.restaurantInfo[0][1]} onChange={this.onChange}></input>
                                  <div className="row m-2">
                                      <button  className="btn btn-primary" style = {{backgroundColor: '#0B658A', border: '#0B658A'}}>Submit</button>
                                  </div>
                              </form>
                       
                      }
                  
              </div>
              <div className = "border-bottom m-3">
                  <h5 className="card-subtitle mb-2 text-muted float-left">Address</h5>
                      {this.state.sectionEdit !== "Address" ? 
                          <p style={{margin: "0", padding: "0.8em"}}>{this.state.restaurantInfo[1][1]}
                              <button  onClick={() => this.editForm("Address") } className="btn btn-outline-dark btn-sm float-right"> <i className='fas fa-edit'></i> </button>
                          </p>
                          : 
                               <form onSubmit = {this.handleSubmit}>
                                  <input  className="form-control" type="text" name = "address" defaultValue={this.state.restaurantInfo[1][1]} onChange={this.onChange}></input>
                                  <div className="row m-2">
                                      <button  className="btn btn-primary" style = {{backgroundColor: '#0B658A', border: '#0B658A'}}>Submit</button>
                                  </div>
                              </form>

                      }
              </div>
              <div className = "border-bottom m-3">
              <h5 className="card-subtitle mb-2 text-muted float-left">Phone Number</h5>
                  {this.state.sectionEdit !== "Phone" ? 
                      <p style={{margin: "0", padding: "0.8em"}}>{this.state.restaurantInfo[2][1]}
                          <button onClick={() => this.editForm("Phone") } className="btn btn-outline-dark btn-sm float-right"> <i className='fas fa-edit'></i> </button>
                      </p>
                      : 
                          <form onSubmit = {this.handleSubmit}>
                              <input  className="form-control" type="text" name = "phone" defaultValue={this.state.restaurantInfo[2][1]} onChange={this.onChange}></input>
                              <div className="row m-2">
                                  <button  className="btn btn-primary" style = {{backgroundColor: '#0B658A', border: '#0B658A'}}>Submit</button>
                              </div>
                          </form>

                  }
              </div>
              <div className = "border-bottom m-3">
              <h5 className="card-subtitle mb-2 text-muted float-left">Opening Time</h5>
                  {this.state.sectionEdit !== "Open" ? 
                      <p style={{margin: "0", padding: "0.8em"}}>{this.state.restaurantInfo[3][1]}
                          <button onClick={() => this.editForm("Open") }className="btn btn-outline-dark btn-sm float-right"> <i className='fas fa-edit'></i> </button>
                      </p>
                      : 
                          <form onSubmit = {this.handleSubmit}>
                              <input  className="form-control" type="text" name = "open" defaultValue={this.state.restaurantInfo[3][1]} onChange={this.onChange}></input>
                              <div className="row m-2">
                                  <button  className="btn btn-primary" style = {{backgroundColor: '#0B658A', border: '#0B658A'}}>Submit</button>
                              </div>
                          </form>
                     
                  }
              </div>
              <div className = "border-bottom m-3">
              <h5 className="card-subtitle mb-2 text-muted float-left">Closing Time</h5>
                  {this.state.sectionEdit !== "Close" ? 
                      <p style={{margin: "0", padding: "0.8em"}}>{this.state.restaurantInfo[4][1]}
                          <button onClick={() => this.editForm("Close") } className="btn btn-outline-dark btn-sm float-right"> <i className='fas fa-edit'></i> </button>
                      </p>
                      : 
                          <form onSubmit = {this.handleSubmit}>
                              <input  className="form-control" type="text" name = "close" defaultValue={this.state.restaurantInfo[4][1]} onChange={this.onChange}></input>
                              <div className="row m-2">
                                  <button  className="btn btn-primary" style = {{backgroundColor: '#0B658A', border: '#0B658A'}}>Submit</button>
                              </div>
                          </form>
                       
                  }
              </div>
              
          </Card.Body>
      </Card>
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
