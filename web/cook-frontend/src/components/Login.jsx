import React, {useState} from 'react';
import {Avatar, Button, CssBaseline, TextField, Link, Grid, Typography, Container} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {makeStyles, useTheme} from '@material-ui/core';
import {Redirect} from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';

/*
login component for managers and cooks to login with.
Asks for the staffID, password and logs in if the user and correct password
exists on the database cookies are set to use persistent state once logged in.
*/

const useStyles = makeStyles(theme => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(2)
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: '#102644',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    margin: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3,0),
    backgroundColor: '#0B658A',
    color: "#FFFFFF"
  },

}));

const cookies = new Cookies();

export default function Login(props) {

  const theme = useTheme();
  const classes = useStyles(theme);

  const [staffID, setStaffID] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [show, setShow] = useState(false);
  const [staff, setStaff] = useState(null);
  const [token, setToken] = useState(null);
  const [alertVariant, setAlertVariant] = useState('');
  const [response, setResponse] = useState('');

  //on submit send form info to the database
  function handleSubmit(event) {
    event.preventDefault();
    /*https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples is where I'm pulling this formatting from.*/
    axios({
      method: 'post',
      url: process.env.REACT_APP_DB + '/staff/login',
      data: 'username=' + staffID + '&password=' + password,
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
          handleShow(response);
        } else {
          // if good response set the state to returned info
          console.log(response);
          if (props.staffType.includes(response.data.staff.position.toLowerCase())) {
            setStaff(response.data.staff);
            setToken(response.data.token);
            setShow(false);
            setRedirect(true);
          }
        }
      })
      .catch(error => {
        setAlertVariant('danger');
        setResponse(error.response.data);
        setShow(true);
        setRedirect(false);
      });
  }

  //on change of ID update state
  function handleID(event) {
    setStaffID(event.target.value);
  }

  //on change of password update state
  function handlePasswd(event) {
    setPassword(event.target.value);
  }

  /* Used to show the correct alert after failing to log in */
  function handleShow(response) {
    let text;
    response.text()
      .then((res) => {
        text = res;
        setAlertVariant('danger');
        if (text) {
          setResponse(text);
        } else {
          setResponse('Failed to login for unknown reason');
        }
        setShow(true);
      })
  }

  if (redirect) {
    /*set the cookies and redirect to the cook page- no validation need
    cook and manager can log in to cook page cookie timesout after 8 hours*/
    cookies.set('mystaff', staff, {path: '/'}, {maxAge: props.cookieAge});
    cookies.set('mytoken', token, {path: '/'}, {maxAge: props.cookieAge});
    return <Redirect to={props.redirect}/>
  }
  // Check if user is already logged in. If logged in then redirect them to cook or manager view.
  // if (cookies.get('mystaff') !== undefined && cookies.get('mytoken') !== undefined) {
  //   // Ensures cook can't access manager view but manager can access cook view.
  //   // TODO: do cook verify and manager verify else could end up in infinite loop
  //   if (props.staffType.includes(cookies.get('mystaff').position)) {
  //     return <Redirect to={props.redirect}/>
  //   }
  // }
  return (
    <Container maxWidth="xs" className="p-3">
      <CssBaseline/>
      <div className={classes.paper}>

        <Alert show={show} variant={alertVariant}>
          {response}
        </Alert>

        <div style={{'textAlign': 'center'}}>
          {/* Lock icon on top */}
          <div style={{'display': 'inline-block'}}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon/>
            </Avatar>
          </div>
          {/* Cook Sign In Title */}
          <Typography component="h1" variant="h5">
            {props.title} Sign In
          </Typography>
        </div>
        {/* Form for putting in user id and password */}
        <form className={classes.form} noValidate>
          <TextField onChange={handleID}
                     value={staffID}
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
          <TextField onChange={handlePasswd}
                     value={password}
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
          <Button onClick={handleSubmit}
                  type="submit"
                  fullWidth
                  variant="contained"
                  className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              {/* Create an account link */}
              <Link href="/sign_up" variant="body2" style={{color: '#0B658A'}}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
            <Grid item>
              {/* Create an account link */}
              <Link href="/forgot_password" variant="body2" style={{color: '#0B658A'}}>
                {"Forgot Password?"}
              </Link>
            </Grid>
          </Grid>
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