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
import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Alert from 'react-bootstrap/Alert';
import Home from './Home';
import Link from '@material-ui/core/Link';
import {Redirect} from "react-router-dom";
import Form from 'react-bootstrap/Form';


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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
/*This Sign up page is used for the a customer after they created their restaurant. 
  They are able to create a manager account by inputing
  staff_id, first_name, last_name, contact_num, 
  email, password to the sign in page. It creates a manager account and the resturant id is
  taken from the cookies */
class ManagerSignUp extends React.Component{

    constructor(props){
    super(props);
    this.cookies = new Cookies();

    this.state = {
        staff_id: '',
        first_name:'',
        last_name:'',
        contact_num:'',
        email: '',
        password:'',
        position: 'manager',
        restaurant_id:this.cookies.get('restaurant_id'),
        confirm_password: '',
        redirect: false,
        show: false,
        token:null,
        staff: null
    };
    
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  onChange = (e) => {
        /*
          On change of the edit field- update the field in the
          state so we can send it to the database.
        */
        this.setState({ [e.target.name]: e.target.value });
      }
 handleSubmit(event){
    event.preventDefault();
  
    https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples is where I'm pulling this formatting from.*/
    
    //if any of the values necessary are not filled out
    if(this.state.staff_id=== '' || this.state.restaurant_id=== ''||
        this.state.first_name===''|| this.state.last_name===''||
        this.state.contact_num===''|| this.state.email=== ''|| 
        this.state.password==='')
    {
      this.setState({alertVariant: 'danger'});
      this.setState({response: "All fields are required"});
      this.setState({redirect: false});
      this.setState({show: true});
      return null;
    }
    //verify staff ID
    if (this.state.staff_id.length<6 || this.state.staff_id.length>50 )
    {  
      this.setState({alertVariant: 'danger'});
      this.setState({response: "Staff ID must be between 6 and 50 characters"});
      this.setState({redirect: false});
      this.setState({show: true});
      return ;
    } 
    //verify first name length / no non-letters
    if (this.state.first_name.length>50 ||   !/[a-z]/.test(this.state.first_name.toLowerCase()) )
    {  
      this.setState({alertVariant: 'danger'});
      this.setState({response: "Invalid first name"});
      this.setState({redirect: false});
      this.setState({show: true});
      return ;
    } 
    //verify last name length / no non-letters
    if ( this.state.last_name.length>50  || !/[a-z]/.test(this.state.last_name.toLowerCase()) )
    {  
      this.setState({alertVariant: 'danger'});
      this.setState({response: "Invalid last name"});
      this.setState({redirect: false});
      this.setState({show: true});
      return ;
    } 

    //verify email formatting
    if (!(/\S+@\S+\.\S+/.test(this.state.email)))
    {  
      this.setState({alertVariant: 'danger'});
      this.setState({response: "Invalid email address"});
      this.setState({redirect: false});
      this.setState({show: true});
      return ;
    } 
    //verify phone formatting
    if (!(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(this.state.contact_num)))
    {
      this.setState({alertVariant: 'danger'});
      this.setState({response: "Invalid phone number"});
      this.setState({redirect: false});
      this.setState({show: true});
      return ;
    }
    //verify password
    if (this.state.password.length<6 || !/[A-Z]/.test(this.state.password) || !/[0-9]/.test(this.state.password) ||  this.state.password.length>50 )
    {  
      this.setState({alertVariant: 'danger'});
      this.setState({response: "Password must contain an uppercase letter, a digit and be between 6 and 50 characters"});
      this.setState({redirect: false});
      this.setState({show: true});
      return ;
    } 
    var phone_number = this.state.contact_num.replace(/\D/g,'');
    axios({
      method: 'PUT',
      url:  process.env.REACT_APP_DB + '/staff/register',
      //+'&logo='+this.state.file
      data: 'staff_id='+this.state.staff_id+'&restaurant_id='+this.state.restaurant_id
              +'&first_name='+this.state.first_name+'&last_name='+this.state.last_name
              +'&contact_num='+phone_number+'&email='+this.state.email
              +'&position='+this.state.position+'&password='+this.state.password,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false,
      }),
    })
    .then(async response => {
      await response;
      if (response.status !== 200) {this.handleShow(false);}
      else {         
            this.handleShow(true,"");
              this.setState({
                redirect: true,
                show: true,
                staff: response.data.staff,
                token: response.data.token,
              });}
    })
    .catch(error => {
      this.handleShow(false);
      console.error("There was an error!", error);
    });

  }
    /* Used to show the correct alert after hitting save item */
  handleShow(success,message) {
    if (success) {
      this.setState({response: "Successfully created staff member: " + this.state.first_name});
      this.setState({alertVariant: 'success'});
    }
    else {
      this.setState({response:  message} )
      this.setState({alertVariant: 'danger'});
    }

    this.setState({show: true});
  }
render() {
     //if sucessful submit redirect to cook view
  if(this.state.redirect === true){
        /*set the cookies and redirect to the manager  page*/
     cookies.set('mytoken', this.state.token, {path: '/'}, {maxAge: 3600});
     cookies.set('mystaff', this.state.staff, {path: '/'}, {maxAge: 3600});
    return(
      <React.Fragment>
        <Alert show={this.state.show} variant={this.state.alertVariant}>
        {this.state.response}
        </Alert>
         <Redirect to="/manager"/>
      </React.Fragment>
      );
  }  
  {
    //Registering cook account
    /*staff_id, restaurant_id, first_name, last_name, contact_num, email, position, password */
    return (
      <Container component="main" maxWidth="xs">
        {/*alert if successful or unsuccessful*/}
        <Alert show={this.state.show} variant={this.state.alertVariant}>
        {this.state.response}
        </Alert>
         <Alert show={true} variant= 'success'>
          Thank you for signing up with AutoGarcon - please create manager account to start
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
             Sign Up

              </Typography>
            <br />
          </div>
          <form className={useStyles.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField onChange = {this.onChange}
                  autoComplete="fname"
                  name="first_name"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField onChange = {this.onChange}
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="last_name"
                  autoComplete="lname"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField onChange = {this.onChange}
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField onChange = {this.onChange}
                  variant="outlined"
                  required
                  fullWidth
                  id="phone"
                  label="Contact Number"
                  name="contact_num"
                  autoComplete="phone"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField onChange = {this.onChange}
                  variant="outlined"
                  required
                  fullWidth
                  id="staffid"
                  label="Staff ID"
                  name="staff_id"
                  autoComplete="staffid"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField onChange = {this.onChange}
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField onChange = {this.onChange}
                  variant="outlined"
                  required
                  fullWidth
                  name="confirm_password"
                  label="Confirm Password"
                  type="password"
                  id="confirm_password"
                  autoComplete="confirmpassword"
                />
              </Grid>
            </Grid>
            <Button onClick = {this.handleSubmit}
              type="submit"
              fullWidth
              variant="contained"
              style={{backgroundColor: '#0B658A', color:"#FFFFFF"}} 
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
}
export default ManagerSignUp;
