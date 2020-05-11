import React from "react";
import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Form from 'react-bootstrap/Form';
import EditFieldRightIcon from '@material-ui/icons/ChevronRight';
import EditFieldDownIcon from '@material-ui/icons/KeyboardArrowDown';
import snakeCase from "lodash.snakecase";

/*this is the customize component for the currently logged in
account. The info is prefilled from the cookies stored
during log in. 
*/

class AccountSettings extends React.Component{
  constructor(props) {     
    super(props);
    
    this.cookies = new Cookies();
    this.state = {
      showEmail: false,
      showFirstName: false,
      showLastName: false,
      showPhoneNumber: false,
      token: this.cookies.get('mytoken'),
      email: this.cookies.get('mytoken').email,
      first_name: this.cookies.get('mytoken').first_name,
      last_name: this.cookies.get('mytoken').last_name,
      contact_num: this.cookies.get('mytoken').contact_num,
      edited: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  /* Used for connecting to Customization in database */
  handleSubmit(event) {
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

  // Capitilize certain fields first letter from https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

  fieldStatus(field) {
    if (this.state['show'+field]) {
      return (
        <div className="py-2 pr-2">
          <Form.Control onChange={() => {if (this.state.edited == false) this.setState({edited: true})}} defaultValue={this.cookies.get("mystaff")[snakeCase(field)]} />
        </div>
      )
    }
    else return (<></>)
  }

  labelStatus(field) {
    let snakeCaseField = snakeCase(field)

    if (!this.state['show'+field]) {
      return (
        <small className="text-secondary">{this.cookies.get("mystaff")[snakeCaseField]}</small>
      )
    }
    else return (<></>)
  }

  showField(event) {
    event.preventDefault();
    const target = event.target;
    //const value = target.value;
    const name = target.name;

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
        <button type="button" className="btn btn-primary" style={{"width":"33%"}}>Update</button>
      )
    }
    else return (<></>)
  }

  render() {
    return(
      <div style={{"width": "70vw"}}>
        <div className="p-3 text-center">
          <h1>Account</h1>
        </div>

        <div>
          <ul className="list-group-flush" style={{"fontSize": "1.25rem"}}>
            <li className="list-group-item">
              <div>{this.capitalizeFirstLetter(this.cookies.get("mystaff").position)}</div>
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
