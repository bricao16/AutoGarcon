import React, {useState} from "react";
import {makeStyles, AppBar, Tab, Tabs, Toolbar} from "@material-ui/core";
import {Link} from "react-router-dom";
import { ThemeProvider, createMuiTheme, withStyles, useTheme} from "@material-ui/core/styles";

const StyledTabs = withStyles({
  indicator: {
    height: '5px'
  }
})(props => <Tabs {...props} />);

const useStyles = makeStyles(theme => ({
  appbar: {
    background: theme.palette.primary,
    minHeight: 0,
    boxShadow: 'none',
    color: theme.palette.text.primary
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
    margin: theme.spacing(0,3),
  },
  tab: {
    outline: 'none!important',
    textDecoration: 'none!important'
  },
  tabLabel: {
    color: theme.palette.text.primary,
  },
  indicator: {
    height: '5px'
  },
  selected: {
    color: 'white',
    '&:hover': {
      color: 'white'
    }
  }
}));

function Header(props){

  const theme = useTheme();
  const classes = useStyles(theme);

  const [tab, setTab] = useState(props.tab);
  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

  return(
    <AppBar className={classes.appbar} position="static">
      <Toolbar className={classes.toolbar}>
        <h3 className={classes.title}>Orders</h3>
        <StyledTabs value={tab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" className={classes.tabs}>
          <Tab label={<span className={classes.tabLabel}>Active</span>} color="primary" className={classes.tab} classes={{selected: classes.selected}}
               component={Link}
               to={'/cook/orders/active'}
          />
          <Tab label={<span className={classes.tabLabel}>Completed</span>} color="primary" className={classes.tab} classes={{selected: classes.selected}}
               component={Link}
               to={'/cook/orders/completed'}
          />
        </StyledTabs>
      </Toolbar>
    </AppBar>
  )
}

export default Header;