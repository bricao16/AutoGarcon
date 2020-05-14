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
import Alert from 'react-bootstrap/Alert';
import Link from '@material-ui/core/Link';
import ChangePassword from './ChangePassword';



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
/*This Forgot password page is used when a cook or manager forgets their password.
  The staff member is prompted to enter in their StaffID. A temporary password will be made for their account
  and an email will be sent to them with the new temporary password. After this, they will be redirected to a
  change password page where they can enter their temporary password to set up their new password.
  */
class ForgotPassword extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      staff_id: '',
      redirect: false,
      show: false,
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
    event.preventDefault();


    axios({
      method: 'post',
      url: process.env.REACT_APP_DB + '/staff/password/forgot',
      data: 'staff_id=' + this.state.staff_id,
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
      this.setState({ response: "Successfully sent temporary password to user: " + this.state.staff_id });
      this.setState({ alertVariant: 'success' });
    }
    else {
      this.setState({ response: message })
      this.setState({ alertVariant: 'danger' });
    }

    this.setState({ show: true });
  }
  render() {
    //if sucessful submit redirect to cook view
    if (this.state.redirect === true) {
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
                <ChangePassword section="" />
              </div>
              <br />
            </div>
          </div>
        </Container>
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
              Forgot Password

          </Typography>
            <br />
          </div>
          <form className={useStyles.form} onSubmit={this.handleSubmit}>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <TextField onChange={this.onChange}
                  variant="outlined"
                  required
                  fullWidth
                  id="staffid"
                  label="Staff ID"
                  name="staff_id"
                  autoComplete="staffid"
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
              Send Link
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
export default ForgotPassword;