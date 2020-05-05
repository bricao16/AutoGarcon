import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Redirect } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';

/*login component for the cook
view. Asks for the staffID, password and logs in if the user and correct password
exists on the database cookies are set to use persistant state once logged in.*/
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

const cookies = new Cookies();

export default class CLogin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      staffID: '',
      passwd: '',
      redirect: false,
      show: false,
      staff: null,
      token: null
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleID = this.handleID.bind(this);
    this.handlePasswd = this.handlePasswd.bind(this);
  }
  //on submit send form info to the database
  handleSubmit(event) {
    event.preventDefault();
    /*https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples is where I'm pulling this formatting from.*/

    axios({
      method: 'post',
      url: process.env.REACT_APP_DB + '/staff/login',
      data: 'username=' + this.state.staffID + '&password=' + this.state.passwd,
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
        if (response.status !== 200) { this.handleShow(response); }
        else {
          //if good response set the state to returned info
          this.setState({
            staff: response.data.staff,
            token: response.data.token,
            show: false,
            redirect: true
          });
        }
      })
      .catch(error => {
        this.setState({ alertVariant: 'danger' });
        this.setState({ response: error.response.data });
        this.setState({ redirect: false });
        this.setState({ show: true });
        console.error("There was an error!", error);
      });
  }
  //on change of ID update state
  handleID(event) {
    this.setState({ staffID: event.target.value });
  }
  //on change of password update state
  handlePasswd(event) {
    this.setState({ passwd: event.target.value });
  }

  /* Used to show the correct alert after failing to log in */
  handleShow(response) {
    var text;

    response.text()
      .then((res) => {
        text = res;
        this.setState({ alertVariant: 'danger' });

        if (text) {
          this.setState({ response: text });
        }
        else {
          this.setState({ response: 'Failed to login for unknown reason' });
        }

        this.setState({ show: true });
      })
  }

  render() {
    if (this.state.redirect === true) {
      /*set the cookies and redirect to the cook page- no validation need
      cook and manager can log in to cook page cookie timesout after 8 hours*/
      cookies.set('mystaff', this.state.staff, { path: '/' }, {maxAge: 28800});
      cookies.set('mytoken', this.state.token, { path: '/' },{maxAge: 28800});
      return <Redirect to='/cook' />
    }
    return (
      <Container component="main" maxWidth="xs" className="p-3">
        <CssBaseline />
        <div className={useStyles.paper}>

          <Alert show={this.state.show} variant={this.state.alertVariant}>
            {this.state.response}
          </Alert>

          <div style={{ 'textAlign': 'center' }}>
            {/* Lock icon on top */}
            <div style={{ 'display': 'inline-block' }}>
              <Avatar className={useStyles.avatar}>
                <LockOutlinedIcon />
              </Avatar>
            </div>
            {/* Cook Sign In Title */}
            <Typography component="h1" variant="h5">
              Cook Sign In
          </Typography>
          </div>
          {/* Form for putting in user id and password */}
          <form className={useStyles.form} noValidate>
            <TextField onChange={this.handleID}
              value={this.state.staffID}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="staffID"
              label="Staff ID"
              name="staffID"
              autoComplete="staffID"
              autoFocus
            />
            <TextField onChange={this.handlePasswd}
              value={this.state.passwd}
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
            {/* Remember me checkbox No functionality yet
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />*/}
            {/* Submit button */}
            <Button onClick={this.handleSubmit}
              type="submit"
              fullWidth
              variant="contained"
              style={{ backgroundColor: '#0B658A', color: "#FFFFFF" }}
              className={useStyles.submit}
            >
              Sign In
          </Button>
            <Grid container>
              <Grid item xs>
                {/* Create an account link */}
                <Link href="/sign_up" variant="body2" style={{ color: '#0B658A' }}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
              <Grid item>
                {/* Create an account link */}
                <Link href="/forgot_password" variant="body2" style={{ color: '#0B658A' }}>
                  {"Forgot Password?"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}