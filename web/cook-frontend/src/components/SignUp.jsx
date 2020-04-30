import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
//import {Redirect} from "react-router-dom";
import https from 'https';
import axios from 'axios';
import Link from '@material-ui/core/Link';

//import Cookies from 'universal-cookie';

/*this sign up will be used to create a 
restuarant. 
It currently has no functionality other
than a outline of a form to be submitted*/

//const cookies = new Cookies();

const useStyles = makeStyles(theme => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: '#102644',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const initialState = {
  //initial field initialization
  first_name: '',
  last_name: '',
  contact_num: '',
  email: '',
  staff_id: '',
  password: '',
  confirm_password: '',

  //error initialization
  firstNameError: "",
  lastNameError: "",
  emailError: "",
  contactError: "",
  staffIDError: "",
  passwordError: "",
  confirmPasswordError: ""
};

class SignUp extends React.Component {
  state = initialState;

  constructor(props) {
    super(props);

    this.state = {
      staff_id: '',
      first_name: '',
      last_name: '',
      contact_num: '',
      email: '',
      password: '',
      confirm_password: '',
      redirect: false,
      show: false,
      position: "manager",
      token: null
    };

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange = event => {
    const isCheckbox = event.target.type === "checkbox";
    this.setState({
      [event.target.name]: isCheckbox
        ? event.target.checked
        : event.target.value
    });
  };

  onChange = (e) => {
    /*
      On change of the edit field- update the field in the
      state so we can send it to the database.
    */
    this.setState({ [e.target.name]: e.target.value });

  }

  //function to check errors
  validate = () => {
    let firstNameError = "";
    let lastNameError = "";
    let emailError = "";
    let contactError = "";
    let staffIDError = "";
    let passwordError = "";
    let confirmPasswordError = "";

    var letters = /^[A-Za-z]+$/;
    var hyphen = '-';
    var numbers = /^[0-9]+$/;
    var passwordCheck = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}$/;

    //First name errors

    //Check first name is not blank
    if (!this.state.first_name) {
      firstNameError = "First name cannot be blank";
    }
    //check first name is not greater than 30 characters
    else if (this.state.first_name.length > 30) {
      firstNameError = "First name cannot have greater than 30 characters";
    }
    //check that first name contains only letters or hyphens
    else if (!(this.state.first_name.match(letters) || this.state.first_name.match(hyphen))) {
      firstNameError = "First name can only contain letters or '-' symbol ";
    }
    //check if first letter is upper case
    else if (!(/[A-Z]/.test(this.state.first_name[0]))) {
      firstNameError = "First name must start with a capital letter";
    }

    //last name errors

    //Check last name is not blank
    else if (!this.state.last_name) {
      lastNameError = "Last name cannot be blank";
    }
    //check last name is not greater than 30 characters
    else if (this.state.last_name.length > 30) {
      lastNameError = "Last name cannot have greater than 30 characters";
    }
    //check that last name contains only letters or hyphens
    else if (!(this.state.last_name.match(letters) || this.state.first_name.match(hyphen))) {
      lastNameError = "Last name can only contain letters or hyphen (-) ";
    }
    //check if first letter is upper case
    else if (!(/[A-Z]/.test(this.state.last_name[0]))) {
      lastNameError = "Last name must start with a capital letter";
    }

    //email errors 

    //check if email is blank
    else if (!this.state.email) {
      emailError = "Email cannot be blank"
    }
    //check if email contains @ symbol
    else if (!this.state.email.includes("@")) {
      emailError = "Invalid email. Must contain a @ symbol";
    }
    //check if email conttains . symbol
    else if (!this.state.email.includes(".")) {
      emailError = "Invalid email. Must contain a . symbol";
    }
    //check last name is not greater than 30 characters
    else if (this.state.email.length > 30) {
      emailError = "Email cannot have greater than 30 characters";
    }

    //contact number errors

    //check if contact is blank
    else if (!this.state.contact_num) {
      contactError = "Contact number cannot be blank"
    }
    //check that phone number contains only numbers
    else if (!(this.state.contact_num.match(numbers) || this.state.contact_num.match(hyphen))) {
      contactError = "Contact number must only contain numbers or hyphen (-) ";
    }
    //check contact number is not greater than 15 characters
    else if (this.state.contact_num.length > 15) {
      contactError = "Contact number cannot have greater than 15 characters";
    }
    //check contact number is not greater than 15 characters
    else if (this.state.contact_num.length < 5) {
      contactError = "Contact number must have at least 5 characters";
    }

    //staff ID errors

    //check if staff id is blank
    else if (!this.state.staff_id) {
      staffIDError = "Staff ID cannot be blank"
    }
    //check staff ID is not greater than 30 characters
    else if (this.state.staff_id.length > 30) {
      staffIDError = "Staff ID cannot have greater than 30 characters";
    }
    //check staff ID is longer than 4 characters long
    else if (this.state.staff_id.length < 5) {
      staffIDError = "Staff ID must be greater than 4 characters long";
    }
    //password errors

    //check if password is blank
    else if (!this.state.password) {
      passwordError = "Password cannot be blank"
    }
    //check if password is between 8-20 characters, has one digit, uppercase, and lowercase letter
    else if (!(this.state.password.match(passwordCheck))) {
      passwordError = "Password must be between 8 to 20 characters, contain at least one numeric digit, one uppercase and one lowercase letter";
    }

    //confirm password errors

    //check if confirm password is blank
    else if (!this.state.confirm_password) {
      confirmPasswordError = "Password cannot be blank"
    }
    else if (!(this.state.confirm_password == this.state.password)) {
      confirmPasswordError = "Error: Passwords do not match"
    }


    if (emailError || firstNameError || lastNameError || contactError || staffIDError || passwordError || confirmPasswordError) {
      this.setState({ emailError, firstNameError, lastNameError, contactError, staffIDError, passwordError, confirmPasswordError });
      return false;
    }

    return true;
  };


  handleSubmit(event) {

    event.preventDefault();
    const isValid = this.validate();
    if (isValid) {
      console.log(this.state);
      // clear form
      this.setState(initialState);
    }

    /*https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples is where I'm pulling this formatting from.*/
    //if any of the values necessary are not filled out

    // Formatting to use
    // if(this.state.staff_id=== '' || this.state.restaurant_id=== ''||
    //     this.state.first_name===''|| this.state.last_name===''||
    //     this.state.contact_num===''|| this.state.email=== ''|| 
    //     this.state.password==='')
    // {
    //   return alert('All fields are required');
    // }
    // //verify email formatting
    // if (!(/\S+@\S+\.\S+/.test(this.state.email)))
    // {  
    //      return alert("You have entered an invalid email address!");
    // } 
    // //verify phone formatting
    // if (!(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(this.state.contact_num)))
    // {
    //   return alert("You have entered an invalid phone number")
    // }
    axios({
      method: 'put',
      url: 'http://50.19.176.137:8000/staff/register',
      data: 'staff_id=' + this.state.staff_id + '&restaurant_id=' + this.state.restaurant_id
        + '&first_name=' + this.state.first_name + '&last_name=' + this.state.last_name
        + '&contact_num=' + this.state.contact_num + '&email=' + this.state.email
        + '&position=' + this.state.position + '&password=' + this.state.password,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    })
      .then(async response => {
        await response;
        //if response if bas alert user
        if (response.status !== 200) { this.handleShow(response); }
        else {
          //if resonse is good redirect
          response.json()
            .then(
              (result) => {
                this.setState({
                  redirect: true,
                  show: false,
                });
              }
            );
        }
      })
      .catch(error => {
        // alert('Unsuccessful Submit');
        this.setState({ alertVariant: 'danger' });
        this.setState({ response: "Unknown error" });
        this.setState({ redirect: false });
        console.error("There was an error!", error);
      });

  }




  render() {

    return (
      <Container component="main" maxWidth="xs" className="p-3">
        <CssBaseline />
        <div className={useStyles.paper}>
          <div style={{ 'textAlign': 'center' }}>
            {/* Lock icon on top */}
            <div style={{ 'display': 'inline-block' }}>
              <Avatar className={useStyles.avatar}>
                <LockOutlinedIcon />
              </Avatar>
            </div>
            <Typography component="h1" variant="h5">
              Sign up

              </Typography>
            <br />
          </div>
          <form className={useStyles.form} onSubmit={this.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField onChange={this.onChange}
                  autoComplete="fname"
                  name="first_name"
                  variant="outlined"
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={this.state.first_name}
                  onChange={this.handleChange}
                  autoFocus
                />
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.firstNameError}
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField onChange={this.onChange}
                  variant="outlined"
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="last_name"
                  autoComplete="lname"
                  value={this.state.last_name}
                  onChange={this.handleChange}
                />
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.lastNameError}
                </div>
              </Grid>
              <Grid item xs={12}>
                <TextField onChange={this.onChange}
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.emailError}
                </div>
              </Grid>
              <Grid item xs={12}>
                <TextField onChange={this.onChange}
                  variant="outlined"
                  fullWidth
                  id="phone"
                  label="Contact Number"
                  name="contact_num"
                  value={this.state.contact_numb}
                  onChange={this.handleChange}
                />
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.contactError}
                </div>
              </Grid>
              <Grid item xs={12}>
                <TextField onChange={this.onChange}
                  variant="outlined"
                  fullWidth
                  id="staffid"
                  label="Staff ID"
                  name="staff_id"
                  value={this.state.staff_id}
                  onChange={this.handleChange}
                />
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.staffIDError}
                </div>
              </Grid>
              <Grid item xs={12}>
                <TextField onChange={this.onChange}
                  variant="outlined"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                />
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.passwordError}
                </div>
              </Grid>
              <Grid item xs={12}>
                <TextField onChange={this.onChange}
                  variant="outlined"
                  fullWidth
                  name="confirm_password"
                  label="Confirm Password"
                  type="password"
                  id="confirm_password"
                  value={this.state.confirm_password}
                  onChange={this.handleChange}
                />
                <div style={{ fontSize: 12, color: "red" }}>
                  {this.state.confirmPasswordError}
                </div>
              </Grid>

            </Grid>
            <br />
            {/*onClick = {this.handleSubmit}*/}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{ backgroundColor: '#0B658A', color: "#FFFFFF" }}
              className={useStyles.submit}
            >
              Sign Up
              </Button>
            <Grid container>
              <Grid item>
                {/* Create an account link */}
                <Link href="/" variant="body2" style={{ color: '#0B658A' }}>
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </form>

        </div>
      </Container>
    );
  }
}
export default SignUp;
