import React from "react";
import Container from 'react-bootstrap/Container';

import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Alert from 'react-bootstrap/Alert';
import EditFieldRightIcon from '@material-ui/icons/ChevronRight';
import EditFieldDownIcon from '@material-ui/icons/KeyboardArrowDown';
import snakeCase from "lodash.snakecase";
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
    
    this.cookies = new Cookies();
		
    this.state = {
      showName: false,
      showAddress: false,
      showPhone: false,
      showDescription: false,
      showCuisine:false,
      restaurantInfo: [],
      sectionEdit: "",
      show:false,
      name:this.props.info.name,
      address: this.props.info.address,
      phone: this.phoneFormat(this.props.info.phone_number),
			description: this.props.info.description,
			cuisine: "American",
      opening: this.props.info.opening,
      closing:this.props.info.closing,
      edited: false,
      restaurant_id :this.cookies.get("mystaff").restaurant_id,
      token:this.cookies.get('mytoken')
    };

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShow = this.handleShow.bind(this);
		this.handleValidation = this.handleValidation.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

  }

  onChange = (e) => {
        /*
          Because we named the inputs to match their
          corresponding values in state, it's
          super easy to update the state
        */
        this.setState({ [e.target.name]: e.target.value });
      }
  /* Used for connecting to restaurantInfo in database */
  handleSubmit(event) {
    console.log(this.state);
		/*Validation for restaurant name.*/
		if(this.state.name.length > 40){
			this.handleValidation("Restaurant name is too long.  Please reduce to 40 characters or less.");
      return;
		} 
    else if (this.state.address.length > 40){

			this.handleValidation("Restaurant address is too long.  Please reduce to 40 characters or less.");
    }
		/*Phone number */

    else if (!(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(this.state.phone)))
    {
      this.handleValidation("Invalid phone number");
      return ;
    }
		/*Validation for opening field.*/	
		else if (Number(this.state.opening) < 0 || Number(this.state.opening) > 2400){
			this.handleValidation("Valid opening time not entered.  Please enter a time between 0 and 2400.");
      return;
		} else if (isNaN((this.state.opening))){
			this.handleValidation("No number entered for opening time.  Please enter a time between 0 and 2400.");	
      return;	
		} else if (!Number.isInteger(parseFloat(this.state.opening))){
			this.handleValidation("No integer entered for opening time.  Please enter a time between 0 and 2400.");
      return;
			
		/*Validation for closing field.*/	
		} else if (Number(this.state.closing) < 0 || Number(this.state.closing) > 2400){
			this.handleValidation("Valid closing time not entered.  Please enter a time between 0 and 2400.");
      return;
		} else if (isNaN((this.state.closing))){
			this.handleValidation("No number entered for closing time.  Please enter a time between 0 and 2400.");
      return;		
		} else if (!Number.isInteger(parseFloat(this.state.closing))){
			this.handleValidation("No integer entered for closing time.  Please enter a time between 0 and 2400.");
      return;
		} else {
			
			var phone_number = this.state.phone.replace(/\D/g,'');
			this.editForm("");
			event.preventDefault();
			axios({
				method: 'POST',
				url:  process.env.REACT_APP_DB +'/restaurant/update/',
				data: 'restaurant_id='+this.state.restaurant_id+'&name='+this.state.name+
				'&address='+this.state.address+'&phone='+phone_number+
				'&opening='+this.state.opening+'&closing='+this.state.closing+'&cuisine='+this.state.cuisine+'&email='+"whatever",
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
				this.handleShow(false, error.response.data);
				console.error("There was an error!", error);
			});
		}
	}
    /* Inserts dashes to format the number correctly */
  phoneFormat(number) {
    return this.insert(this.insert(number + "", 3, "-"), 7, "-");
  }
    /* Used for handling changes to the input field */
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = snakeCase(target.name);

    if (this.state.edited === false) this.setState({edited: true})

    this.setState({
      [name]: value
    });
  }
	
  /* Used to show the correct alert after hitting save item */
  handleShow(success, message) {
    if (success) {
      this.setState({response: "Successfully "+message+"!"});
      this.setState({alertVariant: 'success'});

    }
    else {
      this.setState({response: message})
      this.setState({alertVariant: 'danger'});
    }
    this.setState({show: true});
		
		setTimeout(() => {
      window.location.reload();
			this.setState({
			show:false
			});
		}, 1000)
  }
	
	handleValidation(message){
		this.setState({response: message});
		this.setState({alertVariant: 'danger'});
		this.setState({show: true});
		
		setTimeout(() => {
			this.setState({
			  show:false
			});
		}, 2500)
  }

  //change the category of which is being edited
  editForm = (category) => {
      this.setState({
        sectionEdit: category
    })
  }
	
	time_convert(num) { 
		const hours = Math.floor(num / 60);  
		const minutes = num % 60;
		if(num < 1200){
			return '${hours}:${minutes} AM';  
		}	else {
			return '${hours}:${minutes} PM';
		}
		console.log("Reaching into here.\n");
  }
/* Dynamic fields that are shown if the internal state is stored as showing */
  fieldStatus(field) {
    if (this.state['show'+field]) {
      return (
        <div className="py-2 pr-2">
          <input className="form-control" onChange={this.handleInputChange} name={snakeCase(field)} defaultValue={this.state[snakeCase(field)]}></input>
        </div>
      )
    }
    else return (<></>)
  }
  /* For inserting substrings.  This is necessary for field formats */
  insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
  }

  /* Dynamic labels for each corresponding field */
  labelStatus(field) {
    let snakeCaseField = snakeCase(field)
     // Format for phone number
    //if (field == "Phone") text = this.phoneFormat(text);

    if (!this.state['show'+field]) {
      return (
        <small className="text-secondary">{this.state[snakeCaseField]}</small>
      )
    }
    else return (<></>)
  }

  /* When the toggle icon is toggled the internal show state for the corresponding field is toggled */
  showField(event) {
    event.preventDefault();
    const target = event.target;
    const name = target.name;

    let stateField = "show" + name;

    this.setState({
      [stateField]: !this.state[stateField]
    });
  }

  /* Edit icon is turned on its side when clicked to show the user is now editing */
  toggleEditIcon(field) {
    if (this.state["show"+field]) {
      return (
        <EditFieldDownIcon style={{"pointerEvents": "none", color: this.state.secondary}} fontSize="large"></EditFieldDownIcon>
      )
    }
    else {
      return (
        <EditFieldRightIcon style={{"pointerEvents": "none"}} fontSize="large"></EditFieldRightIcon>
      )
    }
  }

  /* Dynamic update button that is shown when a field is edited */
  updateButton() {
    if (this.state.edited) {
      return (
        <button onClick={this.handleSubmit} type="button" className="btn btn-primary" style = {{backgroundColor: '#0B658A', border: '#0B658A', "width":"33%"}}>Update</button>
      )
    }
    else return (<></>)
  }
	
  renderInfo(){
            const primary = this.props.primary;

        const font = this.props.font;
        const font_color = this.props.font_color
     return(
      <div style={{"width": "70vw"}}>

        <div>

          

          <ul className="list-group-flush " style={{"fontSize": "1.25rem"}}>

            <li className="list-group-item" style ={{'backgroundColor': primary, 'fontFamily': font, 'color': font_color, 'textAlign' : 'center'}}>
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <h2 className="text-center" >Restaurant Information</h2>

                </div>

              </div>
            </li>

            <li className="list-group-item">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <div>Name</div>
                  {this.labelStatus("Name")}
                  {this.fieldStatus("Name")}
                </div>
                <button onClick={(event) => this.showField(event)} className="btn btn-link" name="Name" style={{"cursor": "pointer"}}>
                  {this.toggleEditIcon("Name")}
                </button>
              </div>
            </li>

            <li className="list-group-item">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <div>Address</div>
                  {this.labelStatus("Address")}
                  {this.fieldStatus("Address")}
                </div>
                <button onClick={(event) => this.showField(event)} className="btn btn-link" name="Address" style={{"cursor": "pointer"}}>
                  {this.toggleEditIcon("Address")}
                </button>
              </div>
            </li>

            <li className="list-group-item">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <div>Phone</div>
                  {this.labelStatus("Phone")}
                  {this.fieldStatus("Phone")}
                </div>
                <button onClick={(event) => this.showField(event)} className="btn btn-link" name="Phone" style={{"cursor": "pointer"}}>
                  {this.toggleEditIcon("Phone")}
                </button>
              </div>
            </li>

            <li className="list-group-item">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <div>Cuisine Type</div>
                  {this.labelStatus("Cuisine")}
                  {this.fieldStatus("Cuisine")}
                </div>
                <button onClick={(event) => this.showField(event)} className="btn btn-link" name="Cuisine" style={{"cursor": "pointer"}}>
                  {this.toggleEditIcon("Cuisine")}
                </button>
              </div>
            </li>
            <li className="list-group-item">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <div>Opening Time</div>
                  {this.labelStatus("Opening")}
                  {this.fieldStatus("Opening")}
                </div>
                <button onClick={(event) => this.showField(event)} className="btn btn-link" name="Opening" style={{"cursor": "pointer"}}>
                  {this.toggleEditIcon("Opening")}
                </button>
              </div>
            </li>
            <li className="list-group-item">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <div>Closing Time</div>
                  {this.labelStatus("Closing")}
                  {this.fieldStatus("Closing")}
                </div>
                <button onClick={(event) => this.showField(event)} className="btn btn-link" name="Closing" style={{"cursor": "pointer"}}>
                  {this.toggleEditIcon("Closing")}
                </button>
              </div>
            </li>
          </ul>

          <div className="d-flex justify-content-center">
            {this.updateButton()}
          </div>
        </div>
      </div>
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
            <Container onLoad= {()=>this.time_convert(this.state.restaurantInfo[3][1])} style = {backgroundStyle}>

                <Alert show={this.state.show} variant={this.state.alertVariant}>
                  {this.state.response}
                </Alert>

                    <Container >
                        <div className="d-flex flex-wrap">
                            {this.renderInfo()}
                        </div>
                    </Container>


            </Container>
        );
    }
}

const backgroundStyle = {

  'minWidth': '70vw',
  'minHeight':'90vh'
};

export default StoreInfo;
