import React, {useEffect, useState} from 'react';
import { makeStyles, useTheme, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import {AppBar, Toolbar, Tabs, Tab} from '@material-ui/core'
import {Link} from 'react-router-dom'

import exampleCompanyLogo from '../../assets/exampleCompanyLogo.png'

import AccountDropdown from "../AccountDropdown";

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


  // Changes which tab is highlighted
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return(
    <ThemeProvider theme={theme}>
      <AppBar className={classes.appBar} position="sticky">
        <Toolbar className={classes.toolbar}>
          <img src={companyLogo}  width="auto" height="45px" alt="company logo" />
          <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" className={classes.tabs} >
            <Tab label="Orders" color="primary" className={classes.tab} component={Link} to={'/cook/orders'} />
            <Tab label="Menu" color="primary" className={classes.tab} component={Link} to={'/cook/menu'} />
            <Tab label="Messages" color="primary" className={classes.tab} component={Link} to={'/cook/messages'} />
          </Tabs>
          <div className={classes.account}>
            <AccountDropdown firstName={cookies.staff.first_name} lastName={cookies.staff.last_name} />
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  )
}

export default Header;