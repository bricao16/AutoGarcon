import React, {useState} from "react";
import {makeStyles, AppBar, Toolbar} from "@material-ui/core";
import {ThemeProvider, createMuiTheme, withStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  appbar: {
    background: '#0b658a',
    minHeight: 0,
    boxShadow: 'none'
  },
  toolbar: {
    // alignItems: 'flex-start',
    padding: theme.spacing(3,0,0,4),
    minHeight: 0,
    // flexDirection: 'column'
  },
  title: {
    color: '#f1f1f1',
    // margin: theme.spacing(5)
  }
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ffffff',
    }
  },
});

function Header(props){

  // const theme = useTheme();
  const classes = useStyles(theme);

  return(
    <ThemeProvider theme={theme}>
      <AppBar className={classes.appbar} position="static">
        <Toolbar className={classes.toolbar}>
          <h3 className={classes.title}>{props.title}</h3>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  )
}

export default Header;