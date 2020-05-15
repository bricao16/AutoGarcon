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
import Link from '@material-ui/core/Link';
import {Redirect} from "react-router-dom";

import Home from './Home';


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
/*
  This change password page is used for managers and cooks who have forgotten their password and
  had an email sent to them with a temporary password after entering their StaffID when clicking Forgot Password.
  After entering their Staff ID, old password(temporary password), and new password, it will change their
  password to their new password
  */
const cookies = new Cookies();
class ChangePassword extends React.Component {

  constructor(props) {
    super(props);
    

    this.state = {
      staff_id: '',
      current_password: '',
      new_password:'',
      confirm_new_password: '',
      redirect: false,
      show: false,
      token: cookies.get('mytoken'),
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
  handleSubmit(event) {
    console.log(this.state);
    //make sure correct temp password
    if (this.handleLogin() === false)
    {
      console.log("FALSE");
    }

    event.preventDefault();

    //verify password
    if (this.state.new_password.length<6 || !/[A-Z]/.test(this.state.new_password) || !/[0-9]/.test(this.state.new_password) ||  this.state.new_password.length>50 )
    {  
      this.setState({alertVariant: 'danger'});
      this.setState({response: "Password must contain an uppercase letter, a digit and be between 6 and 50 characters"});
      this.setState({redirect: false});
      this.setState({show: true});
      return ;
    } 
    //verify confirm password
    if (this.state.new_password !== this.state.confirm_new_password)
    {  
      this.setState({alertVariant: 'danger'});
      this.setState({response: "Passwords must match"});
      this.setState({redirect: false});
      this.setState({show: true});
      return ;
    } 
    axios({
      method: 'post',
      url: process.env.REACT_APP_DB + '/staff/password/update',
      data: 'staff_id=' + this.state.staff_id +'&current_password='+this.state.current_password
      +'&new_password='+this.state.new_password,
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
        this.setState({ redirect: false });
        console.error("There was an error!", error);
      });

  }
  handleLogin() {

    /*https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples is where I'm pulling this formatting from.*/
    axios({
      method: 'post',
      url: process.env.REACT_APP_DB + '/staff/login',
      data: 'username=' + this.state.staff_id + '&password=' + this.state.current_password,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    })
      .then(async response => {
        await response;
        //if a bad response alert the user
        if (response.status !== 200) {
          this.handleShow(response);
        } else {
          // if good response set the tokens
          console.log(response);
          this.setState({ redirect: false });
          cookies.set('mystaff', response.data.staff, {path: '/'}, {maxAge: 28800});
          cookies.set('mytoken', response.data.token, {path: '/'}, {maxAge: 28800});
          this.setState({ redirect: false ,
                          token : cookies.get('mytoken')});
          return true;
        }
      })
      .catch(error => {
        this.handleShow(false, error.response.data);
        this.setState({ redirect: false });
        console.error("There was an error!", error);
        return false;
      });

  }
  /* Used to show the correct alert after hitting save item */
  handleShow(success, message) {
    if (success) {
      this.setState({ response: "Successfully changed password for user: " + this.state.staff_id });
      this.setState({ alertVariant: 'success' });
    }
    else {
      this.setState({ response: message })
      this.setState({ alertVariant: 'danger' });
    }

    this.setState({ show: true });
    setTimeout(() => {
      this.setState({
      show:false
      });
    }, 2000)
  }
  render() {
    //if sucessful submit redirect to Home
    if (this.state.redirect === true ) {
        /*setTimeout(() => {
               this.props.history.push('/');
            }, 1000)*/
      return (
        <div>
          <Alert show={this.state.show} variant={this.state.alertVariant}>
            {this.state.response}
          </Alert>
        </div>
      );
    }

    //Registering cook account
    /*staff_id, restaurant_id, first_name, last_name, contact_num, email, position, password */
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
            Change Password

          </Typography>
          <br />
        </div>
        <form className={useStyles.form} onSubmit={this.handleSubmit}>
          <Grid container spacing={2}>

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
                  name="current_password"
                  label="Temp Password"
                  type="password"
                  id="current_password"
                  autoComplete="current_password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField onChange = {this.onChange}
                  variant="outlined"
                  required
                  fullWidth
                  name="new_password"
                  label="New Password"
                  type="password"
                  id="new_password"
                  autoComplete="new_password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField onChange = {this.onChange}
                  variant="outlined"
                  required
                  fullWidth
                  name="confirm_new_password"
                  label="Confirm Password"
                  type="password"
                  id="confirm_new_password"
                  autoComplete="confirm_new_password"
                />
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
            Change Password
          </Button>
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
        </form>

      </div>
    </Container>
    );



  }
}
export default ChangePassword;