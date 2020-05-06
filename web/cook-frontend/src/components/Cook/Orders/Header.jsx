import React from "react";
import {makeStyles, AppBar, Tab, Tabs, Toolbar} from "@material-ui/core";
import {Link} from "react-router-dom";
import {useTheme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    alignItems: 'center',
    padding: theme.spacing(0)
  },
  tab: {
    outline: 'none!important',
    textDecoration: 'none!important'
  }
}));

function Header(){

  const theme = useTheme();
  const classes = useStyles(theme);

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return(
    <Toolbar className={classes.toolbar}>
      <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" className={classes.tabs} >
        <Tab label="Active" color="secondary" className={classes.tab} component={Link} to={'/cook/orders/active'} />
        <Tab label="Completed" color="secondary" className={classes.tab} component={Link} to={'/cook/orders/completed'} />
      </Tabs>
    </Toolbar>
  )
}

export default Header;