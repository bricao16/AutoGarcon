import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Redirect} from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import Manager from './Manager/Manager';
import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';

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

class SignUp extends React.Component{
    /*staff_id, restaurant_id, first_name, last_name, contact_num, email, position, password */
    constructor(props){
    super(props);
    
    this.state = {
        staff_id: '',
        restaurant_id: '',
        first_name:'',
        last_name:'',
        contact_num:'',
        position:'',
        email: '',
        password:'',
        redirect: false,
        show: false,
        restaurant_id:cookies.get('mystaff').restaurant_id,
        position:cookies.get('mystaff').position,
        token:null
    };
    
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange = (e) => {
        /*
          On change of the edit field- update the field in the
          state so we can send it to the database.
        */
        this.setState({ [e.target.name]: e.target.value });
        console.log(this.state);
      }
 handleSubmit(event){
    
    event.preventDefault();
    
    /*https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples is where I'm pulling this formatting from.*/
    
    this.state.restaurant_id = cookies.get('mystaff').restaurant_id;
    console.log(this.state);
    axios({
      method: 'put',
      url: 'http://50.19.176.137:8000/staff/register',
      data: 'staff_id='+this.state.staff_id+'&restaurant_id='+this.state.restaurant_id
              +'&first_name='+this.state.first_name+'&last_name='+this.state.last_name
              +'&contact_num='+this.state.contact_num+'&email='+this.state.email
              +'&position='+this.state.position+'&password='+this.state.password,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false,
      }),
    })
      .then(async response => {
        await response;
        
        if (response.status !== 200) {this.handleShow(response);}
        else 
        {
          console.log(response);
          /*response.json()
          .then(
            (result) => {
              console.log(result);*/
              this.setState({
                redirect: true,
                show: false,
                staff: response.data.staff,
                token:response.data.token
              });
                  cookies.set('my-staff', this.state.staff, { path: '/' });
            cookies.set('my-token', this.state.token, { path: '/' });
     }
            //);

          //this.setState({show: false});
          //this.setState({redirect: true});
        
      })
      .catch(error =>{
        alert('Unsuccessful Submit');
        this.setState({alertVariant: 'danger'});
        this.setState({response: "Unknown error"});
        this.setState({redirect: false});
        console.error("There was an error!", error);
      });

  }
render() {
  const cookies = new Cookies();
  if(this.state.redirect === true){
    alert("Sucessful Staff Creation");
    return  <Redirect to='/cookview'/> 
  }  
  if(cookies.get('mystaff').position == "manager")
  {
    //Registering cook account
    /*staff_id, restaurant_id, first_name, last_name, contact_num, email, position, password */
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={useStyles.paper}>
          <Avatar className={useStyles.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
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
            </Grid>
            <i> Please make note of this information and give to your staff member </i>
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

        </div>
      </Container>
    );
  
    }

  }
}
export default SignUp;