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
import {Redirect} from "react-router-dom";
import https from 'https';
import axios from 'axios';
import Link from '@material-ui/core/Link';
import Alert from 'react-bootstrap/Alert';
import Home from './Home';


import Cookies from 'universal-cookie';

/*this sign up will be used to create a 
restuarant. 
It currently has no functionality other
than a outline of a form to be submitted*/

const cookies = new Cookies();

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


class SignUp extends React.Component {

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
      restaurant_id: cookies.get('mystaff').restaurant_id,
      position: "manager",
      token: null
    };

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShow = this.handleShow.bind(this);

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



  handleSubmit(event) {
    console.log(this.state);

    event.preventDefault();

    //if any of the values necessary are not filled out
    if (this.state.staff_id === '' || this.state.restaurant_id === '' ||
      this.state.first_name === '' || this.state.last_name === '' ||
      this.state.contact_num === '' || this.state.email === '' ||
      this.state.password === '' || this.state.confirm_password === '') {
      this.setState({ alertVariant: 'danger' });
      this.setState({ response: "All fields are required" });
      this.setState({ redirect: false });
      this.setState({ show: true });
      return null;
    }
    //verify staff ID
    if (this.state.staff_id.length < 6 || this.state.staff_id.length > 50) {
      this.setState({ alertVariant: 'danger' });
      this.setState({ response: "Staff ID must be between 6 and 50 characters" });
      this.setState({ redirect: false });
      this.setState({ show: true });
      return;
    }
    //verify first name length / no non-letters
    if (this.state.first_name.length > 50 || !/[a-z]/.test(this.state.first_name.toLowerCase())) {
      this.setState({ alertVariant: 'danger' });
      this.setState({ response: "Invalid first name" });
      this.setState({ redirect: false });
      this.setState({ show: true });
      return;
    }
    //verify last name length / no non-letters
    if (this.state.last_name.length > 50 || !/[a-z]/.test(this.state.last_name.toLowerCase())) {
      this.setState({ alertVariant: 'danger' });
      this.setState({ response: "Invalid last name" });
      this.setState({ redirect: false });
      this.setState({ show: true });
      return;
    }

    //verify email formatting
    if (!(/\S+@\S+\.\S+/.test(this.state.email))) {
      this.setState({ alertVariant: 'danger' });
      this.setState({ response: "Invalid email address" });
      this.setState({ redirect: false });
      this.setState({ show: true });
      return;
    }
    //verify phone formatting
    if (!(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(this.state.contact_num))) {
      this.setState({ alertVariant: 'danger' });
      this.setState({ response: "Invalid phone number" });
      this.setState({ redirect: false });
      this.setState({ show: true });
      return;
    }
    //verify password
    if (this.state.password.length < 6 || !/[A-Z]/.test(this.state.password) || !/[0-9]/.test(this.state.password) || this.state.password.length > 50) {
      this.setState({ alertVariant: 'danger' });
      this.setState({ response: "Password must contain an uppercase letter, a digit and be between 6 and 50 characters" });
      this.setState({ redirect: false });
      this.setState({ show: true });
      return;
    }

    //verify confirm password
    if (!(this.state.password == this.state.confirm_password)) {
      this.setState({ alertVariant: 'danger' });
      this.setState({ response: "Passwords must match" });
      this.setState({ redirect: false });
      this.setState({ show: true });
      return;
    }

    axios({
      method: 'put',
      url: process.env.REACT_APP_DB + '/staff/register',
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

        if (response.status !== 200) { this.handleShow(false, ""); }
        else {
          this.handleShow(true, "");
          this.setState({
            redirect: true,
            show: true,
          });
        }
      })
      .catch(error => {
        this.handleShow(false, error.response.data);
        //this.setState({alertVariant: 'danger'});
        //this.setState({response: "Unknown error"});
        this.setState({ redirect: false });
        console.error("There was an error!", error);
      });

  }
  /* Used to show the correct alert after hitting save item */
  handleShow(success, message) {
    if (success) {
      this.setState({ response: "Successfully created staff member: " + this.state.first_name });
      this.setState({ alertVariant: 'success' });
    }
    else {
      this.setState({ response: message })
      this.setState({ alertVariant: 'danger' });
    }

    this.setState({ show: true });
  }


  state = { redirect: null };

  render() {
    //if sucessful submit redirect to cook view
    if (this.state.redirect === true) {
      return (
          <Alert show={this.state.show} variant={this.state.alertVariant}>
            {this.state.response}
          </Alert>
      );
    }
    if (cookies.get('mystaff').position === "manager") {
      return (
        <Container component="main" maxWidth="xs" className="p-3">
          {/*alert if successful or unsuccessful*/}

          <Alert show={this.state.show} variant={this.state.alertVariant}>
            {this.state.response}
          </Alert>
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

              <Button onClick={this.handleSubmit}
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
}
export default SignUp;
