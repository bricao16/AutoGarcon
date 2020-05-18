import React from "react";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ChromePicker } from 'react-color';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';

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
          fonts: [ 'Oswald', 'Raleway', 'Open Sans', 'Lato', 'Pt Sans', 'Lora', 'Montserrat', 'Playfair Display', 'Benchnine', 'Merriweather'],
          sectionEdit: "",
          show:false,
          font: this.props.info.font,
          primary: this.props.info.primary_color ,
          secondary: this.props.info.secondary_color,
          tertiary: this.props.info.tertiary_color,
          temp_primary: this.props.info.primary_color,
          temp_secondary: this.props.info.secondary_color,
          temp_tertiary:this.props.info.tertiary_color,
          temp_font : this.props.info.font,
          font_color : this.props.info.font_color,
          temp_font_color: this.props.info.font_color,
          file: this.props.logo,
          temp_file:this.props.logo,
          fileName:"Choose file",
          alexaGreeting: this.props.info.greeting,
          temp_alexaGreeting: this.props.info.greeting,
          restaurant_id :cookies.get("mystaff").restaurant_id,
          token:cookies.get('mytoken')
        };

    this.onChange = this.onChange.bind(this);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShow = this.handleShow.bind(this);
		this.handleValidation = this.handleValidation.bind(this);

  }
    /*
      On change of the edit field- update the field in the
      state so we can send it to the database.
    */
  onChange = (e) => {

      //colors
      if(this.state.sectionEdit ==="Primary")
      {  this.setState({ 'temp_primary':  e.hex});
      }
      else if(this.state.sectionEdit ==="Secondary")
      {
        this.setState({ 'temp_secondary':  e.hex});
      }
      else if(this.state.sectionEdit ==="Tertiary")
      {
        this.setState({ 'temp_tertiary':  e.hex});
      }
      else if(this.state.sectionEdit ==="Font")
      {
        this.setState({ 'temp_font':  e.target.value});
      }
      else if(this.state.sectionEdit ==="Font Color")
      {
        this.setState({ 'temp_font_color':  e.hex});
      }
      else if(this.state.sectionEdit ==="Alexa Greeting")
      {
        this.setState({ 'temp_alexaGreeting':  e.target.value});
      }
      
    }

      onChangeFile(e) {
      const target = e.target;
      const value = target.value;
      const name = target.name;
        //https://riptutorial.com/javascript/example/14207/getting-binary-representation-of-an-image-file
        // preliminary code to handle getting local file and finally printing to console
        // the results of our function ArrayBufferToBinary().
        this.setState({ fileName: target.files[0].name });

        var file = target.files[0]; /* get handle to local file. */
        var reader = new FileReader();
        reader.onload = function(event) {
          var data = event.target.result;
          var finaldata = new Uint8Array(data);

          /* set our file to the correct data */
          file.buffer = finaldata;
          this.setState({file:  file});
        }.bind(this);
        reader.readAsArrayBuffer(file); /* gets an ArrayBuffer of the file */

      }
  /* Used for connecting to Customization in database */
  submitToDB(){
    /*https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples is where I'm pulling this formatting from.*/

    var bodyFormData = new FormData();
    bodyFormData.set('restaurant_id', this.state.restaurant_id);
    bodyFormData.set('primary_color', this.state.primary);
    bodyFormData.set('secondary_color', this.state.secondary);
    bodyFormData.set('tertiary_color', this.state.tertiary);
    bodyFormData.set('font', this.state.font);
    bodyFormData.set('font_color', this.state.font_color);
    bodyFormData.set('greeting', this.state.alexaGreeting);
    bodyFormData.append('logo', this.state.file);

    axios({
      method: 'POST',
      url:  process.env.REACT_APP_DB +'/restaurant/customization',
      data: bodyFormData,
      headers: {
        'Content-Type': 'multipart/form-data',
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

  handleSubmit(event) {
      //finalize whatever section value was chosen then submit to database
      if(this.state.sectionEdit ==="Primary")
      {  
        this.setState({ 'primary': this.state.temp_primary},
          this.submitToDB);

      }
      else if(this.state.sectionEdit ==="Secondary")
      {

         this.setState({ 'secondary': this.state.temp_secondary},
          this.submitToDB);
      }
      else if(this.state.sectionEdit ==="Tertiary")
      {
         this.setState({ 'tertiary': this.state.temp_tertiary},
          this.submitToDB);
      }

      else if(this.state.sectionEdit ==="Font Color")
      {
         this.setState({ 'font_color': this.state.temp_font_color},
          this.submitToDB);
      }
      else if(this.state.sectionEdit ==="Font")
      {
         this.setState({ 'font': this.state.temp_font},
          this.submitToDB);
      }
      else if(this.state.sectionEdit ==="Logo")
      {
        this.submitToDB();
      }
      else if(this.state.sectionEdit ==="Alexa Greeting")
      {
				if(this.state.temp_alexaGreeting.length > 100){
					this.handleValidation("Greeting is too long.  Please limit to 100 characters or less.");	
					this.setState({'temp_alexaGreeting':'alexaGreeting'}); //revert temp gretting back to current greeting
				} else {
					 this.setState({ 'alexaGreeting': this.state.temp_alexaGreeting},
						this.submitToDB);
				}
      }
    this.editForm("");
	}
	
	/* Used to validate input for alexa greeting */
	handleValidation(message){ 
		this.setState({response: message});
		this.setState({alertVariant: 'danger'});
		this.setState({show: true});
		
		setTimeout(() => {
			this.setState({
			  show:false
			});
		}, 3000)
  }

  /* Used to show the correct alert after hitting save item */
  handleShow(success, message) {
    if (success) {
      this.setState({response: "Successfully "+message+"!"});
      this.setState({alertVariant: 'success'});
      this.handleModalClose();
      this.forceUpdate();
    }
    else {
      this.setState({response: 'Failed to update'})
      this.setState({alertVariant: 'danger'});
    }

    this.setState({show: true});
    
    setTimeout(() => {
      window.location.reload();
      this.setState({
      show:false
      });
    }, 3000)
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
//convert image to blob from https://stackoverflow.com/questions/42471755/convert-image-into-blob-using-javascript
loadXHR(url) {
    return new Promise(function(resolve, reject) {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.responseType = "blob";
            xhr.onerror = function() {reject("Network error.")};
            xhr.onload = function() {
                if (xhr.status === 200) {resolve(xhr.response)}
                else {reject("Loading error:" + xhr.statusText)}
            };
            xhr.send();
        }
        catch(err) {reject(err.message)}
    });
}
  handleModalClose = () => this.setState({ModalShow: false});
  handleModalShow = () => this.setState({ModalShow: true});

renderInfo(){
  const font = this.state.font;
    return (
          <>
            <Modal show={this.state.ModalShow} onHide={this.handleModalClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>{this.state.sectionEdit}</Modal.Title>
              </Modal.Header>

                    {/*primary*/}
                    {this.state.sectionEdit === "Primary" && 
                    <Modal.Body style={{backgroundColor:this.state.temp_primary}}>
                      <div className="container">
                        <div className="row">
                          <Container>
                              <ChromePicker
                                color={ this.state.temp_primary }
                                onChangeComplete={this.onChange }
                              />
                              <br/>
                               <div className="row m-2">
                                  <button  onClick ={this.handleSubmit}className="btn btn-primary" style = {{backgroundColor: '#0B658A', border: '#0B658A'}}>Submit</button>
                              </div>
                            </Container>
                          </div>
                        </div>
                      </Modal.Body>
                    }
                    {/*Secondary*/}
                    {this.state.sectionEdit === "Secondary" && 
                    <Modal.Body style={{backgroundColor:this.state.temp_secondary}}>
                      <div className="container">
                        <div className="row">
                          <Container>
                              <ChromePicker
                                color={ this.state.temp_secondary }
                                onChangeComplete={this.onChange }
                              />
                              <br/>
                               <div className="row m-2">
                                  <button  onClick ={this.handleSubmit}className="btn btn-primary" style = {{backgroundColor: '#0B658A', border: '#0B658A'}}>Submit</button>
                              </div>
                            </Container>
                          </div>
                        </div>
                      </Modal.Body>
                    }
                    {/*tertiary*/}
                    {this.state.sectionEdit === "Tertiary" && 
                    <Modal.Body style={{backgroundColor:this.state.temp_tertiary}}>
                      <div className="container">
                        <div className="row">
                          <Container>
                            <ChromePicker
                              color={ this.state.temp_tertiary }
                              onChangeComplete={this.onChange }
                            />
                             <form onSubmit = {this.handleSubmit}>

                              <div className="row m-2">
                                  <button  className="btn btn-primary" style = {{backgroundColor: '#0B658A', border: '#0B658A'}}>Submit</button>
                              </div>
                            </form>
                          </Container>
                         </div>
                        </div>
                      </Modal.Body>
                      }
                    {/*font color*/}
                    {this.state.sectionEdit === "Font Color" && 
                    <Modal.Body style={{backgroundColor:this.state.temp_font_color}}>
                      <div className="container">
                        <div className="row">
                          <Container>
                            <ChromePicker
                              color={ this.state.temp_font_color }
                              onChangeComplete={this.onChange }
                            />
                          </Container>
                          </div>
                          <form onSubmit = {this.handleSubmit}>
                            <div className="row m-2">
                                <button  className="btn btn-primary" style = {{backgroundColor: '#0B658A', border: '#0B658A'}}>Submit</button>
                            </div>
                          </form>
                        </div>
                      </Modal.Body>
                    }
                   {/*Alexa Greeting*/}
                    {this.state.sectionEdit === "Alexa Greeting" && 
                    <Modal.Body>
                      <div className="container">
                          <form onSubmit = {this.handleSubmit}>
                            <input  className="form-control" type="text" name = "address" defaultValue={this.state.alexaGreeting} onChange={this.onChange}></input>
                              <div className="row m-2">
                                  <button  className="btn btn-primary" style = {{backgroundColor: '#0B658A', border: '#0B658A'}}>Submit</button>
                              </div>
                          </form>
                        </div>
                      </Modal.Body>
                    }
                    {/*Logo*/}
                    {this.state.sectionEdit === "Logo" && 
                    <Modal.Body>
                        <Container>
                            <div className="input-group">
                              <div className="custom-file">
                                <input type="file" className="custom-file-input" id="customFile" name="image" accept="image/png, image/jpg, image/jpeg" onChange={this.onChangeFile}></input>
                                <label className="custom-file-label" htmlFor="customFile">{this.state.fileName}</label>
                              </div>
                              <label className="custom-file-label" htmlFor="inputGroupFile01">
                                {this.state.fileName}
                              </label>
                              </div>
                 
                            <br/>
                            <div className="row m-2">
                               <button  onClick = {this.handleSubmit} className="btn btn-primary" style = {{backgroundColor: '#0B658A', border: '#0B658A'}}>Submit</button>
                            <button onClick={() => this.editForm("")} type="button" className="btn btn-outline-danger ml-4" >Cancel</button>
                             </div>
                         </Container>
                      </Modal.Body>
                    }


            </Modal>
           <Container >
            <Row className = "align-items-start">
            <Col>
              <Card className="text-center m-2" style ={{'fontFamily' :font}}>
                  <Card.Header  >Font 
                  <button onClick={() => this.editForm("Font") } className="btn btn-outline-dark btn-sm float-right"> <i className='fas fa-edit'></i> </button>
                  </Card.Header>
                      <Card.Body style = {{minHeight:'20vh'}}>
                          {/* if Font is not the section to edit render the database info and a button to edit*/}

                          {this.state.sectionEdit !== "Font" ?
                            <p style={{margin: "0", padding: "0.8em"}}>{this.state.font}</p>
                              :   
                              <form className="form-inline" >
                              {/* choose font and submit to change font */}
                              <div style= {{float: 'left'}}>
                                  <select id="lang" onChange={this.onChange} >
                                      {/* <option value="Selected">{this.state.customizeInfo[5][1]}</option> */}
                                      
                                      {/* dropdown menu options */}
                                      <option value="Oswald" style ={{'fontFamily' :'Oswald'}}>{this.state.fonts[0]}</option>
                                      <option value="Raleway" style ={{'fontFamily' :'Raleway'}}>{this.state.fonts[1]}</option>
                                      <option value="Open Sans" style ={{'fontFamily' :'Open Sans'}}>{this.state.fonts[2]}</option>
                                      <option value="Lato" style ={{'fontFamily' :'Lato'}}>{this.state.fonts[3]}</option>
                                      <option value="Pt Sans" style ={{'fontFamily' :'Pt Sans'}}>{this.state.fonts[4]}</option>
                                      <option value="Lora" style ={{'fontFamily' :'Lora'}}>{this.state.fonts[5]}</option>
                                      <option value="Montserrat" style ={{'fontFamily' :'Montserrat'}}>{this.state.fonts[6]}</option>
                                      <option value="Playfair Display" style ={{'fontFamily' :'Playfair Display'}}>{this.state.fonts[7]}</option>
                                      <option value="Benchnine" style ={{'fontFamily' :'Benchnine'}}>{this.state.fonts[8]}</option>
                                      <option value="Merriweather" style ={{'fontFamily' :'Merriweather'}}>{this.state.fonts[9]}</option>


                                  </select>     
                              </div>
                              <br></br>
                              <div className="row m-2">
                                  <button onClick = {this.handleSubmit} type="button" className="btn btn-primary m-1" style = {{backgroundColor: '#0B658A', border: '#0B658A'}}>Submit</button>
                                  <button onClick={() => this.editForm("") }  type="button" className="btn btn-outline-danger m-1" >Cancel</button>
                              </div>
                              
                           </form>
                          }
                      </Card.Body>
                  </Card>
                  </Col>
                  <Col>
                  <Card className="text-center  m-2" style ={{'fontFamily' :font}}>
                    <Card.Header onClick={this.handleModalShow} >Logo
                      <button  onClick={() => this.editForm("Logo") } className="btn btn-outline-dark btn-sm float-right"> <i className='fas fa-edit'></i> </button>
                    </Card.Header>
                    <Card.Body style = {{minHeight:'20vh'}}>
                      <div className = "p-3">
                            <img src={this.state.file}  width="auto" height="40vh" alt="waiter" /> 
                      </div> 
                    </Card.Body>
                   </Card>
                  </Col>
                   <Col>
                   <Card className="text-center m-2" style ={{'fontFamily' :font}}>
                    <Card.Header onClick={this.handleModalShow}>Alexa Greeting
                      <button  onClick={() => this.editForm("Alexa Greeting") } className="btn btn-outline-dark btn-sm float-right"> <i className='fas fa-edit'></i> </button>
                    </Card.Header>
                    <Card.Body style = {{minHeight:'20vh'}}>
                      <p> {this.state.alexaGreeting} </p>
                    </Card.Body>
                    </Card>
                  </Col>
                </Row>

                 <Row className = "align-items-start">

                  <Col>
                  <Card className="text-center m-2" style ={{'fontFamily' :font}} >
                    <Card.Header onClick={this.handleModalShow}>Primary
                      <button onClick={() => this.editForm("Primary") } className="btn btn-outline-dark btn-sm float-right ml-4"> <i className='fas fa-edit'></i> </button>
                    </Card.Header>
                    <Card.Body style={{backgroundColor:this.state.primary,minHeight:'10vh'}}>

                    </Card.Body>
                   </Card>
                  </Col>
                  <Col>
                  <Card className="text-center m-2" style ={{'fontFamily' :font}}>
                    <Card.Header onClick={this.handleModalShow}>Secondary
                      <button onClick={() => this.editForm("Secondary") } className="btn btn-outline-dark btn-sm float-right ml-4"> <i className='fas fa-edit'></i> </button>
                    </Card.Header>
                    <Card.Body style={{backgroundColor:this.state.secondary, minHeight:'10vh'}}>

                    </Card.Body>
                   </Card>
                  </Col>
                   <Col>
                   <Card className="text-center m-2" style ={{'fontFamily' :font}}>
                    <Card.Header onClick={this.handleModalShow}>Tertiary
                      <button  onClick={() => this.editForm("Tertiary") } className="btn btn-outline-dark btn-sm float-right ml-4"> <i className='fas fa-edit'></i> </button>
                    </Card.Header>
                    <Card.Body style={{backgroundColor:this.state.tertiary,minHeight:'10vh' }}>

                    </Card.Body>
                   </Card>
                   </Col>
                  <Col>
                   <Card className="text-center m-2" style ={{'fontFamily' :font}}>
                    <Card.Header onClick={this.handleModalShow}>Font Color
                      <button  onClick={() => this.editForm("Font Color") } className="btn btn-outline-dark btn-sm float-right ml-4"> <i className='fas fa-edit'></i> </button>
                    </Card.Header>
                    <Card.Body style={{backgroundColor:this.state.font_color, minHeight:'10vh'}}>
                    </Card.Body>
                   </Card>
                   </Col>
                  </Row>
                </Container>
            </>
        )

}
    render() {
        const {customizeInfo } = this.state;
        const resturantInfo = this.props.info;
        //get the styles
        const primary = this.props.primary;

        const font = this.state.font;
        const font_color = this.props.font_color
        //put resturant info into an array
        Object.keys(resturantInfo).forEach(function(key) {
            customizeInfo.push([key ,resturantInfo[key]]);
        });
        return (
            <Container>
                <div style={backgroundStyle}>
                <h2 style ={{'fontFamily' :font, 'backgroundColor': primary, 'color': font_color, 'textAlign' : 'center','height':'54px', 'paddingTop':'8px'}}>
                  Customize
                </h2>
                <Alert show={this.state.show} variant={this.state.alertVariant}>
                  {this.state.response}
                </Alert>
                    <Container fluid style={{'minHeight': '70vh',   'minWidth': '100%'}}>
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
  'minWidth': '75vw',
  'fontFamily' :'Open Sans'
}

const itemStyle = {
    'borderBottom': 'grey solid 1px',

};


export default Customize;
