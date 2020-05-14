import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import https from 'https';
import axios from 'axios';
import Link from '@material-ui/core/Link';
import Alert from 'react-bootstrap/Alert';
import ManagerSignUp from './ManagerSignUp'

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
      restaurant_name: '',
      restaurant_address: '',
      contact_num: '',
      staff: '',
      token: '',      
      email: '',
      opening: '',
      closing: '',
      cuisine: '',
      redirect: false,
      show: false,
      //restaurant_id: cookies.get('mystaff').restaurant_id,
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
    if (this.state.restaurant_name === '' || this.state.restaurant_address === '' ||
      this.state.contact_num === '' || this.state.email === '') {
      this.setState({ alertVariant: 'danger' });
      this.setState({ response: "All fields are required" });
      this.setState({ redirect: false });
      this.setState({ show: true });
      return null;
    }
    //verify restaurant name
    if (this.state.restaurant_name.length > 50) {
      this.setState({ alertVariant: 'danger' });
      this.setState({ response: "Restaurant name cannot be greater than 50 characters" });
      this.setState({ redirect: false });
      this.setState({ show: true });
      return;
    }
    //verify restaurant address
    if (this.state.restaurant_address.length > 50) {
      this.setState({ alertVariant: 'danger' });
      this.setState({ response: "Restaurant address cannot be greater than 50 characters" });
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

   
      /*Validation for opening field.*/
     else if (Number(this.state.opening) < 0 || Number(this.state.opening) > 2400) {
      this.handleValidation("Valid opening time not entered.  Please enter a time between 0 and 2400.");
    } else if (isNaN((this.state.opening))) {
      this.handleValidation("No number entered for opening time.  Please enter a time between 0 and 2400.");
    } else if (!Number.isInteger(parseFloat(this.state.opening))) {
      this.handleValidation("No integer entered for opening time.  Please enter a time between 0 and 2400.");

      /*Validation for closing field.*/
    } else if (Number(this.state.closing) < 0 || Number(this.state.closing) > 2400) {
      this.handleValidation("Valid closing time not entered.  Please enter a time between 0 and 2400.");
    } else if (isNaN((this.state.closing))) {
      this.handleValidation("No number entered for closing time.  Please enter a time between 0 and 2400.");
    } else if (!Number.isInteger(parseFloat(this.state.closing))) {
      this.handleValidation("No integer entered for closing time.  Please enter a time between 0 and 2400.");
    }

    axios({
      method: 'put',
      url: process.env.REACT_APP_DB + '/restaurant/new',
      data: 
        '&restaurant_name=' + this.state.restaurant_name +
        '&restaurant_addr=' + this.state.restaurant_address + 
        '&phone_number=' + this.state.contact_num +
        '&email=' + this.state.email +
        '&opening_time=' + this.state.opening + 
        '&closing_time=' + this.state.closing + 
        '&cuisine=' + this.state.cuisine,
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
          this.state.staff = response.data.substring(response.data.length-3);
          this.setState({
            redirect: true,
            show: true,
          });
        }
      })
      .catch(error => {
        //this.handleShow(false, error.response.data);
        //this.setState({alertVariant: 'danger'});
        //this.setState({response: "Unknown error"});
        this.setState({ redirect: false });
        console.error("There was an error!", error);
      });

  }
  /* Used to show the correct alert after hitting save item */
  handleShow(success, message) {
    if (success) {
      this.setState({ response: "Successfully created restaurant: " + this.state.restaurant_name });
      this.setState({ alertVariant: 'success' });
    }
    else {
      this.setState({ response: message })
      this.setState({ alertVariant: 'danger' });
    }

    this.setState({ show: true });
  }



  render() {
    //if successful submit redirect to Home page
    if (this.state.redirect === true) {
     /*set the cookies and redirect to the manager sign up page*/
     cookies.set('restaurant_id', this.state.staff, {path: '/'}, {maxAge: 3600});

     console.log(cookies.get('restaurant_id'));
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
              <ManagerSignUp section="" />
            </div>
            <br />
          </div>
        </div>
      </Container>
    );
    }
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
              Restaurant Sign Up

              </Typography>
            <br />
          </div>
          <form className={useStyles.form} onSubmit={this.handleSubmit}>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <TextField onChange={this.onChange}
                  variant="outlined"
                  fullWidth
                  id="restaurant_name"
                  label="Restaurant Name"
                  name="restaurant_name"
                  value={this.state.restaurant_name}
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
                  id="restaurant_address"
                  label="Restaurant Address"
                  name="restaurant_address"
                  value={this.state.restaurant_address}
                  onChange={this.handleChange}
                />

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

              </Grid>
              <Grid item xs={12}>
                <TextField onChange={this.onChange}
                  variant="outlined"
                  fullWidth
                  id="cuisine"
                  label="Cuisine"
                  name="cuisine"
                  value={this.state.cuisine}
                  onChange={this.handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField onChange={this.onChange}
                  variant="outlined"
                  fullWidth
                  id="opening"
                  label="Opening Time"
                  name="opening"
                  value={this.state.opening}
                  onChange={this.handleChange}
                />
                <i>*Please enter in military time</i>
              </Grid>

              <Grid item xs={12}>
                <TextField onChange={this.onChange}
                  variant="outlined"
                  fullWidth
                  id="closing"
                  label="Closing Time"
                  name="closing"
                  value={this.state.closing}
                  onChange={this.handleChange}
                />
                <i>*Please enter in military time</i>

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
          </form>
          <br></br>
          <br></br>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item>
              {/* Link Back Home*/}

              <Link href="/" variant="body2" style={{ color: '#0B658A' }}>
                {"Return to Home"}
              </Link>
            </Grid>
          </Grid>
        </div>
      </Container>
    );

  }
}
export default SignUp;
