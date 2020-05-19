import React, {useEffect, useState} from 'react';
import {makeStyles, createMuiTheme, ThemeProvider, withStyles} from '@material-ui/core/styles';
import {AppBar, Toolbar, Tabs, Tab, Badge} from '@material-ui/core'
import {Link} from 'react-router-dom'
import AccountDropdown from "../AccountDropdown";
import axios from "axios";
import https from "https";

const StyledTabs = withStyles({
  indicator: {
    height: '100%',
    backgroundColor: '#0b658a33',
    pointerEvents: 'none'
  },
})(props => <Tabs {...props} />);

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#f1f1f1',
  },
  toolbar: {
    alignItems: 'center',
    padding: theme.spacing(0, 1),
  },
  tabs: {
    margin: theme.spacing(0,3)
  },
  tab: {
    outline: 'none!important',
    padding: theme.spacing(3,0,2,0),
    textDecoration: 'none!important'
  },
  account: {
    marginLeft: 'auto'
  },
  logo: {
    color: 'black',
    marginLeft: theme.spacing(2)
  }
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0b658a'
    }
  },
});

function Header(props){

  // const theme = useTheme();
  const classes = useStyles(theme);

  const {cookies, restaurantData} = props;

  const logoData = restaurantData.restaurant.logo.data;
  const buffer = Buffer.from(logoData).toString('base64');
  const companyLogo = "data:image/png;base64,"+buffer;

  const [requestCount, setRequestCount] = useState(0);


  // Changes which tab is highlighted
  const [tab, setTab] = React.useState(props.tab);
  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

  useEffect(() => {
    getServiceData();
  }, []);

  function getServiceData(){
    const url = process.env.REACT_APP_DB + '/services/' + cookies.staff.restaurant_id;
    axios.get(url, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + cookies.token
      },
    })
      .then(res => res.data)
      .then(data => {
        setRequestCount(Object.keys(data).length);
      })
      .catch(error =>{
        console.error(error);
      });
  }

  return(
    <ThemeProvider theme={theme}>
      <AppBar className={classes.appBar} position="sticky">
        <Toolbar className={classes.toolbar}>
          <img src={companyLogo}  width="auto" height="45px" alt="company logo" className={classes.logo}/>
          <StyledTabs value={tab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" className={classes.tabs} >
            <Tab label="Orders" color="primary" className={classes.tab} component={Link} to={'/cook/orders'} />
            <Tab label="Edit Menu" color="primary" className={classes.tab} component={Link} to={'/cook/menu'} />
            <Tab label={
                <Badge badgeContent={requestCount} color="primary">
                  <span>Service Requests</span>
                </Badge>
              } color="primary" className={classes.tab} component={Link} to={'/cook/service'}
            />
            {/*<Tab label="Messages" color="primary" className={classes.tab} component={Link} to={'/cook/messages'} />*/}
          </StyledTabs>
          <div className={classes.account}>
            <AccountDropdown firstName={cookies.staff.first_name} lastName={cookies.staff.last_name} />
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  )
}

export default Header;