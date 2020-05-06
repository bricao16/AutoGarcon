import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import {AppBar, Toolbar, Tabs, Tab} from '@material-ui/core'
import {Link} from 'react-router-dom'

import exampleCompanyLogo from '../../assets/exampleCompanyLogo.png'

import AccountDropdown from "../AccountDropdown";


const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#f1f1f1'
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

function Header(props){

  const theme = useTheme();
  const classes = useStyles(theme);

  const {cookies} = props;

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return(
    <AppBar className={classes.appBar} position="sticky">
      <Toolbar className={classes.toolbar}>
        <img src={exampleCompanyLogo}  width="auto" height="40px" alt="waiter" />
        <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" className={classes.tabs} >
          <Tab label="Orders" color="primary" className={classes.tab} component={Link} to={'/cook/orders'} />
          <Tab label="Menu" color="primary" className={classes.tab} component={Link} to={'/cook/menu'} />
        </Tabs>
        <div className={classes.account}>
          <AccountDropdown firstName={cookies.staff.first_name} lastName={cookies.staff.last_name} />
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default Header;