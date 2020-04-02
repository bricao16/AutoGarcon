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

/*this is the login component for the cook
view. Asks for the email address, password and logs in if the user and correct password
exists on the database */
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

export default class SignIn extends React.Component {
  constructor(props){
	  super(props);
	  
	  this.state = {
	    email: '',
		passwd:'',
		redirect: false
	  };
	  
	  this.handleSubmit = this.handleSubmit.bind(this);
	  this.handleEmail = this.handleEmail.bind(this);
	  this.handlePasswd = this.handlePasswd.bind(this);
  }

  handleSubmit(event){
	  
	  event.preventDefault();
	  
	  /*https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples is where I'm pulling this formatting from.*/
	  
	  console.log(this.state.email);
	  console.log(this.state.passwd);
	  
	  const requestOptions = {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/x-www-form-urlencoded'
		},
		/*body: JSON.stringify({
		  'username': this.state.email,
		  'password': this.state.passwd
		})*/
		body: 'username='+this.state.email+'&password='+this.state.passwd
		  
	  };
	  fetch('http://50.19.176.137:8000/staff/login', requestOptions)
		.then(async response => {
			const data = await response.json();
			
			if(!response.ok){
				const error = (data && data.message) || response.status;
				return Promise.reject(error);
			}
			this.setState({redirect: true});
			
		
		})
		.catch(error =>{
			
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

  render(){
	if(this.state.redirect === true){
	  return <Redirect to='/cook'/>
	}  
	return (
  	  <Container component="main" maxWidth="xs">
		  <CssBaseline />
        <div className={useStyles.paper}>
          {/* Lock icon on top */}
          <Avatar className={useStyles.avatar}>
          <LockOutlinedIcon />
          </Avatar>
          {/* Cook Sign In Title on top of page*/}
          <Typography component="h1" variant="h5">
          Cook Sign In
          </Typography>
          <form className={useStyles.form} noValidate>
          <TextField onChange = {this.handleEmail}
            value = {this.state.email}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
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

          {/* Remember me checkbox */}
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
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