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
//import Manager from './Manager/Manager';
import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';



/*this is the login component for the manager
view. Asks for the staff ID, password and logs in if the user and correct password
exists on the database

Privacy Policy needed 
https://html.com/resources/cookies-ultimate-guide/#Implementing_Cookies_on_a_Technical_Level */

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
    width: '100%', 
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const cookies = new Cookies();

class MLogin extends React.Component {
	
  constructor(props){
	  super(props);
	  
	  this.state = {
	    email: '',
		passwd:'',
      	redirect: false,
      	show: false,
      	staff:null,
      	token:null
	  };
	  
    this.handleShow = this.handleShow.bind(this);
	  this.handleSubmit = this.handleSubmit.bind(this);
	  this.handleEmail = this.handleEmail.bind(this);
	  this.handlePasswd = this.handlePasswd.bind(this);
	  
  }

  handleSubmit(event){
	  
	  event.preventDefault();
	  
	  /*https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples is where I'm pulling this formatting from.*/
	  
    
    axios({
      method: 'post',
      url: process.env.REACT_APP_DB + '/staff/login',
      data: 'username='+this.state.email+'&password='+this.state.passwd,
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
        	/*response.json()
		      .then(
		        (result) => {
		        	console.log(result);*/
		        if(response.data.staff.position === "manager")
		        {
			        this.setState({
			            redirect: true,
			            show: false,
			            staff: response.data.staff,
			            token:response.data.token
			          });
		        }
		        else{
		        	alert('Staff ID or Password is incorrect');
		        }

		 }
		        //);

          //this.setState({show: false});
          //this.setState({redirect: true});
        
      })
      .catch(error =>{
        this.setState({alertVariant: 'danger'});
        this.setState({response: "Unknown error"});
        this.setState({redirect: false});
        console.error("There was an error!", error);
      });

  }
  
  handleEmail(event){
	  this.setState({email: event.target.value});
  }
  
  handlePasswd(event){
	  this.setState({passwd: event.target.value});
  }

  /* Used to show the correct alert after failing to log in */
  handleShow(response) {
    var text;    

    response.text()
      .then((res) => {
        text = res;
        this.setState({alertVariant: 'danger'});

        if (text) {
          this.setState({response: text});
        }
        else {
          this.setState({response: 'Failed to login for unknown reason'});
        }

        this.setState({show: true});
      })
  }
   
  render(){
  	/*redirect to manager*/
	if(this.state.redirect === true){

			console.log(cookies.get('mystaff'));
			//set cookies to use later in manager page
			cookies.set('mystaff', this.state.staff, { path: '/' });
			cookies.set('mytoken', this.state.token, { path: '/' });
			console.log(cookies.get('mystaff'));

			return  (
				<Redirect to='/manager'/> 
				);
	}  
	return (
		//top of page
	  	  <Container component="main" maxWidth="xs" className="p-3">
			  <CssBaseline />
	        <div className={useStyles.paper}>

	        <Alert show={this.state.show} variant={this.state.alertVariant}>
	          {this.state.response}
	        </Alert>

	        <div style={{'textAlign':'center'}}>
	          {/* Lock icon on top */}
	          <div style={{'display': 'inline-block'}}>
	            <Avatar className={useStyles.avatar}>
	              <LockOutlinedIcon />
	            </Avatar>
	          </div>
	          {/* Cook Sign In Title */}
	          <Typography component="h1" variant="h5">
	            Manager Sign In
	          </Typography>
	        </div>

			<form className={useStyles.form} noValidate>
			  <TextField onChange = {this.handleEmail}
				value = {this.state.email} /*This is the trouble line */
				variant="outlined"
				margin="normal"
				required
				fullWidth
				id="email"
				label="Staff ID"
				name="email"
				autoComplete="email"
				autoFocus
			  />
			  <TextField onChange = {this.handlePasswd}
				value = {this.state.passwd}
				variant="outlined"
				margin="normal"
				required
				fullWidth
				name="password"
				label="Password"
				type="password"
				id="password"
				autoComplete="current-password"
			  />
			  {/* Remember me check box 
			  <FormControlLabel
				control={<Checkbox value="remember" color ="primary" />}
				label="Remember me"
			  />*/}
			  {/* Submit button */}
			  <Button onClick = {this.handleSubmit}
				type="submit"
				fullWidth
				variant="contained"
				style={{backgroundColor: '#0B658A', color:"#FFFFFF"}} 
				className={useStyles.submit}
			  >
				Sign In
			  </Button>
			  <Grid container>
				<Grid item>
				  {/* Create an account link */}
				  <Link href="/sign_up" variant="body2" style={{color: '#0B658A'}}>
					{"Don't have an account? Sign Up"}
				  </Link>
				</Grid>
			  </Grid>
			</form>
		  </div>		
		</Container>
	);
  }
}
//const MLoginCookies = withCookies(MLogin);
export default MLogin; 