import React from "react";
import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';
import EditFieldIcon from '@material-ui/icons/ChevronRight';

/*this is the customize component for the currently logged in
account. The info is prefilled from the cookies stored
during log in. 
*/

class AccountSettings extends React.Component{
  constructor(props) {     
    super(props);
    
    this.cookies = new Cookies();
    this.state = {
      token: this.cookies.get('mytoken')
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  /* Used for connecting to Customization in database */
  handleSubmit(event) {
    console.log(this.state);

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

  handleModalClose = () => this.setState({ModalShow: false});
  handleModalShow = () => this.setState({ModalShow: true});

  render() {
    console.log(this.cookies.get("mystaff"))
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
            <div className="d-flex">
              <div className="flex-grow-1">
                <div>Email</div>
                <small className="text-secondary">{this.cookies.get("mystaff").email}</small>
              </div>
              <div style={{"cursor": "pointer"}}>
                <EditFieldIcon fontSize="large"></EditFieldIcon>
              </div>
            </div>
          </li>

          <li className="list-group-item">
            <div className="d-flex">
              <div className="flex-grow-1">
                <div>First name</div>
                <small className="text-secondary">{this.cookies.get("mystaff").first_name}</small>
              </div>
              <div style={{"cursor": "pointer"}}>
                <EditFieldIcon fontSize="large"></EditFieldIcon>
              </div>
            </div>
          </li>

          <li className="list-group-item">
            <div className="d-flex">
              <div className="flex-grow-1">
                <div>Last name</div>
                <small className="text-secondary">{this.cookies.get("mystaff").last_name}</small>
              </div>
              <div style={{"cursor": "pointer"}}>
                <EditFieldIcon fontSize="large"></EditFieldIcon>
              </div>
            </div>
          </li>

          <li className="list-group-item">
            <div className="d-flex">
              <div className="flex-grow-1">
                <div>Phone number</div>
                <small className="text-secondary">{this.cookies.get("mystaff").contact_num}</small>
              </div>
              <div style={{"cursor": "pointer"}}>
                <EditFieldIcon fontSize="large"></EditFieldIcon>
              </div>
            </div>
          </li>
        </ul>
        </div>
      </div>
    )
  }
}

const editButtonStyle = {
  'cursor':'pointer',
  'font-size': '1rem',
  'position': 'absolute',
  'right': '0',
  'top': '0'
};

export default AccountSettings;
