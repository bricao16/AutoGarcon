import React from "react";
import {makeStyles, AppBar, Tab, Tabs, Toolbar} from "@material-ui/core";
import {Link} from "react-router-dom";
import {useTheme, ThemeProvider, createMuiTheme, withStyles} from "@material-ui/core/styles";


const StyledTabs = withStyles({
  indicator: {
    height: '5px'
  },
})((props) => <Tabs {...props} />);


const useStyles = makeStyles((theme) => ({
  appbar: {
    background: '#0b658a',
    minHeight: 0,
    boxShadow: 'none'
  },
  toolbar: {
    // alignItems: 'flex-start',
    padding: theme.spacing(3,3,0,3),
    minHeight: 0,
    // flexDirection: 'column'
  },
  title: {
    color: '#f1f1f1',
    // margin: theme.spacing(5)
  },
  tabs: {
    margin: theme.spacing(0,3)
  },
  tab: {
    outline: 'none!important',
    textDecoration: 'none!important'
  }
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ffffff',
    }
  },
});

function Header(){

  // const theme = useTheme();
  const classes = useStyles(theme);

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return(
    <ThemeProvider theme={theme}>
      <AppBar className={classes.appbar} position="static">
        <Toolbar className={classes.toolbar}>
          <h3 className={classes.title}>Orders</h3>
          <StyledTabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary"
                className={classes.tabs} classes={{indicator: {height: "5px"}}}>
            <Tab label="Active" color="primary" className={classes.tab} component={Link} to={'/cook/orders/active'} />
            <Tab label="Completed" color="primary" className={classes.tab} component={Link} to={'/cook/orders/completed'} />
          </StyledTabs>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  )
}

export default Header;