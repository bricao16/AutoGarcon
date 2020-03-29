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
/*this is the login component for the manager
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
    width: '100%', 
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

class MLogin extends React.Component {
	
	constructor(props){
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		
		this.state = {
			
			email: "",
			thispassword: ""
		};
		
	}
	handleSubmit(event){
		
		event.preventDefault();
	}
}

export default function SignIn() {
  const classes = useStyles();
 
  return (
    //top of page
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {/* Lock icon on top */}
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        {/* Manager Sign In Title */}
        <Typography component="h1" variant="h5">
          Manager Sign In
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
			//value = {this.state.email} /*This is the trouble line */
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
          <TextField
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
          {/* Remember me check box */}
          <FormControlLabel
            control={<Checkbox value="remember" color ="Primary" />}
            label="Remember me"
          />
          {/* Submit button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{backgroundColor: '#0B658A', color:"#FFFFFF"}} 
            className={classes.submit}
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