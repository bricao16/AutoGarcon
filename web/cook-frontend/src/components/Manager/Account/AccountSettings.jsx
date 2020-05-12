import React from "react";
import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Alert from 'react-bootstrap/Alert';
import EditFieldRightIcon from '@material-ui/icons/ChevronRight';
import EditFieldDownIcon from '@material-ui/icons/KeyboardArrowDown';
import snakeCase from "lodash.snakecase";
import validator from 'validator';
import {Redirect} from "react-router-dom";

/*this is the customize component for the currently logged in
account. The info is prefilled from the cookies stored
during log in. 
*/

class AccountSettings extends React.Component{
  constructor(props) {     
    super(props);
    
    this.cookies = new Cookies();

    if (this.cookies.get('mystaff') !== undefined) {
      this.state = {
        showEmail: false,
        showFirstName: false,
        showLastName: false,
        showPhoneNumber: false,
        token: this.cookies.get('mytoken'),
        staff_id: this.cookies.get('mystaff').staff_id,
        email: this.cookies.get('mystaff').email,
        first_name: this.cookies.get('mystaff').first_name,
        last_name: this.cookies.get('mystaff').last_name,
        contact_num: this.cookies.get('mystaff').contact_num,
        edited: false,
        response: "No existing error",
        showAlert: false
      };
    }

    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAlertShow = this.handleAlertShow.bind(this);
  }

  sanitize() {
    let result = true

    // Check each field exists
    if (this.state.contact_num.length < 1) return "Phone number is required"
    if (this.state.first_name.length < 1) return "First name is required"
    if (this.state.last_name.length < 1) return "Last name is required"
    if (this.state.email.length < 1) return "Email is required"

    // Each field is correct format
    let numberToString = (this.state.contact_num + '').length
    if (numberToString !== 10) return "Phone number must be 10 digits (ex. 1234567890)"
    if (isNaN(this.state.contact_num)) return "Phone number must be a number"

    if (this.state.last_name.length > 30) return "Last name is too long.  Must be under 30 characters"
    if (isNaN(this.state.last_name) !== true) return "Last name must be a string"

    if (this.state.first_name.length > 30) return "First name is too long.  Must be under 30 characters"
    if (isNaN(this.state.first_name) !== true) return "First name must be a string"

    if (this.state.email.length > 50) return "Email is too long.  Must be under 50 characters"
    if (validator.isEmail(this.state.email + "") !== true) return "Email must be in the format of an email address (ex. test@gmail.com)"

    return true
  }

  /* Used for connecting to Customization in database */
  handleUpdate(event) {
    event.preventDefault();

    // Hide alert if showing
    this.setState({
      showAlert: false
    });

    console.log(this.state)

    let sanitizationResult = this.sanitize();
    if (sanitizationResult !== true) {
      this.handleAlertShow(false, sanitizationResult)
      return
    }

    axios({
      method: 'POST',
      url:  process.env.REACT_APP_DB +'/staff/update',
      data:
        'staff_id='+this.state.staff_id +
        '&first_name='+this.state.first_name +
        '&last_name='+this.state.last_name +
        '&contact_num='+this.state.contact_num +
        '&email='+this.state.email,
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

      if (response.status !== 200) {this.handleAlertShow(false);}
      else {
        this.handleAlertShow(true, "updated");
        this.setState({
          showEmail: false,
          showFirstName: false,
          showLastName: false,
          showPhoneNumber: false,
        })

        let reconfigureCookie = this.cookies.get('mystaff')
        reconfigureCookie.email = this.state.email
        reconfigureCookie.first_name = this.state.first_name
        reconfigureCookie.last_name = this.state.last_name
        reconfigureCookie.contact_num = this.state.contact_num
        this.cookies.set('mystaff', reconfigureCookie, { path: '/' });
      }
    })
    .catch(error => {
      this.handleShow(false, error.response.data);
			console.error("There was an error!", error);
		});
  }

  /* Used to show the correct alert after hitting save item */
  handleAlertShow(success, message) {
    if (success) {
      this.setState({response: "Successfully "+message+"!"});
      this.setState({alertVariant: 'success'});
    }
    else {
      this.setState({response: message})
      this.setState({alertVariant: 'danger'});
    }

    this.setState({showAlert: true});
  }

  /* Used for handling changes to the input field */
  handleInputChange(event) {
    const tarset = event.tarset;
    console.log(tarset)
    const value = tarset.value;
    const name = snakeCase(tarset.name);

    if (this.state.edited == false) this.setState({edited: true})

    this.setState({
      [name]: value
    });
  }

  // Capitilize certain fields first letter from https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  fieldStatus(field) {
    if (this.state['show'+field]) {
      return (
        <div className="py-2 pr-2">
          <input className="form-control" onChange={this.handleInputChange} name={snakeCase(field)} defaultValue={this.cookies.set("mystaff")[snakeCase(field)]}></input>
        </div>
      )
    }
    else return (<></>)
  }

  labelStatus(field) {
    let snakeCaseField = snakeCase(field)

    if (!this.state['show'+field]) {
      return (
        <small className="text-secondary">{this.cookies.set("mystaff")[snakeCaseField]}</small>
      )
    }
    else return (<></>)
  }

  showField(event) {
    event.preventDefault();
    const tarset = event.tarset;
    const name = tarset.name;

    let stateField = "show" + name;

    this.setState({
      [stateField]: !this.state[stateField]
    });
  }

  toggleEditIcon(field) {
    if (this.state["show"+field]) {
      return (
        <EditFieldDownIcon style={{"pointer-events": "none"}} fontSize="large"></EditFieldDownIcon>
      )
    }
    else {
      return (
        <EditFieldRightIcon style={{"pointer-events": "none"}} fontSize="large"></EditFieldRightIcon>
      )
    }
  }

  updateButton() {
    if (this.state.edited) {
      return (
        <button onClick={this.handleUpdate} type="button" className="btn btn-primary" style={{"width":"33%"}}>Update</button>
      )
    }
    else return (<></>)
  }

  render() {
    //if (this.cookies.get('mystaff') === undefined) return <Redirect to={'/login_manager'}/>
    return(
      <div style={{"width": "70vw"}}>
        <div className="p-3 text-center">
          <h1>Account</h1>
        </div>

        <div>

          <Alert style={{"width": "70vw"}} show={this.state.showAlert} variant={this.state.alertVariant}>
            {this.state.response}
          </Alert>

          <ul className="list-group-flush" style={{"fontSize": "1.25rem"}}>
            <li className="list-group-item">
              <div>{this.capitalizeFirstLetter(this.cookies.set("mystaff").position)}</div>
            </li>

            <li className="list-group-item">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <div>Email</div>
                  {this.labelStatus("Email")}
                  {this.fieldStatus("Email")}
                </div>
                <button onClick={(event) => this.showField(event)} className="btn btn-link" name="Email" style={{"cursor": "pointer"}}>
                  {this.toggleEditIcon("Email")}
                </button>
              </div>
            </li>

            <li className="list-group-item">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <div>First name</div>
                  {this.labelStatus("FirstName")}
                  {this.fieldStatus("FirstName")}
                </div>
                <button onClick={(event) => this.showField(event)} className="btn btn-link" name="FirstName" style={{"cursor": "pointer"}}>
                  {this.toggleEditIcon("FirstName")}
                </button>
              </div>
            </li>

            <li className="list-group-item">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <div>Last name</div>
                  {this.labelStatus("LastName")}
                  {this.fieldStatus("LastName")}
                </div>
                <button onClick={(event) => this.showField(event)} className="btn btn-link" name="LastName" style={{"cursor": "pointer"}}>
                  {this.toggleEditIcon("LastName")}
                </button>
              </div>
            </li>

            <li className="list-group-item">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <div>Phone number</div>
                  {this.labelStatus("ContactNum")}
                  {this.fieldStatus("ContactNum")}
                </div>
                <button onClick={(event) => this.showField(event)} className="btn btn-link" name="ContactNum" style={{"cursor": "pointer"}}>
                  {this.toggleEditIcon("ContactNum")}
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
}

export default AccountSettings;
