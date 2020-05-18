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
import CookView from './CSignUp';
import Alert from 'react-bootstrap/Alert';
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
/*This Sign up page is used for the manager to
   to register a cook account by inputing
  staff_id, first_name, last_name, position, contact_num, 
  email, password to the sign in page. The resturant id is
  taken from the cookies */
class CSignUp extends React.Component{

    constructor(props){
    super(props);
    
    this.state = {
        staff_id: '',
        first_name:'',
        last_name:'',
        contact_num:'',
        email: '',
        password:'',
        redirect: false,
        show: false,
        restaurant_id:cookies.get('mystaff').restaurant_id,
        position:"Cook",
        positions:["Cook","Manager"],
        token:null
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
    console.log(this.state);
    event.preventDefault();
  
    /*https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples is where I'm pulling this formatting from.*/
    
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
      method: 'put',
      url: process.env.REACT_APP_DB + '/staff/register',
      data: 'staff_id='+this.state.staff_id+'&restaurant_id='+this.state.restaurant_id
              +'&first_name='+this.state.first_name+'&last_name='+this.state.last_name
              +'&contact_num='+phone_number+'&email='+this.state.email
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
        
        if (response.status !== 200) {this.handleShow(false,"");}
        else 
        {
            this.handleShow(true,"");
              this.setState({
                redirect: true,
                show: true,
              });
        }
      })
      .catch(error =>{
        this.handleShow(false,error.response.data);
        //this.setState({alertVariant: 'danger'});
        //this.setState({response: "Unknown error"});
        this.setState({redirect: false});
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
    return(
      <React.Fragment>
        <Alert show={this.state.show} variant={this.state.alertVariant}>
        {this.state.response}
        </Alert>
        <CookView section=""/> 
      </React.Fragment>
      );
  }  
  if(cookies.get('mystaff').position === "manager")
  {
    //Registering staff account
    /*staff_id, restaurant_id, first_name, last_name, contact_num, email, position, password */
    return (
      <Container component="main" maxWidth="xs">
        {/*alert if successful or unsuccessful*/}
        <Alert show={this.state.show} variant={this.state.alertVariant}>
        {this.state.response}
        </Alert>
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
                 <Form.Group id="lang" onChange={this.onChange} value={this.state.value} name="position">
                    <Form.Control as="select">
                        <option value="Cook">{this.state.positions[0]}</option>
                        <option value="Manager">{this.state.positions[1]}</option>
                    </Form.Control>
                </Form.Group>                  
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
export default CSignUp;