import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/MenuOutlined';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenuOutlined';
import StatsIcon from '@material-ui/icons/TimelineOutlined';
import AccountDropdown from "../../AccountDropdown";
import StaffIcon from '@material-ui/icons/SupervisorAccountOutlined';
import CustomIcon from '@material-ui/icons/ColorLensOutlined';
import GeneralIcon from '@material-ui/icons/ListAltOutlined';
import SettingsVoiceIcon from '@material-ui/icons/SettingsVoice';
import Stats from '../Statistics/Stats';
import Menu from '../Menu/Menu';
import StoreInfo from '../General/StoreInfo';
import QRCode from  '../General/QRCode';
import CookView from '../Staff/CookView';
import AccountSettings from '../Account/AccountSettings';
import Customize from '../Customize/Customize';
import LogoImage from "../../../assets/AutoGarconLogo.png";
import CropFreeIcon from '@material-ui/icons/CropFree';

import {
    Switch,
    Route
  } from "react-router-dom";

const drawerWidth = 270;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#f1f1f1',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,

  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    border:'gray',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {

    flexGrow: 1,
    padding: theme.spacing(3),
  },
  footerStyle: {
  paddingBottom: '5px',
  paddingRight: '12px',
  paddingTop: '12px',
  textAlign: 'right',
  height: '67px'
  },



}));


export default function NavItems(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  //get the styles for the current restuarant
  const primary = props.restaurantInfo[1][1].primary_color;
  const secondary = props.restaurantInfo[1][1].secondary_color;
  const tertiary = props.restaurantInfo[1][1].tertiary_color;
  const font = props.restaurantInfo[1][1].font;
  const font_color = props.restaurantInfo[1][1].font_color

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
    console.log(font);
  return (

    <div className={classes.root} style={{'fontFamily' :font}}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar >
        <div className="col">
          <IconButton
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          </div>

          <div className="col text-right" style={{'fontFamily' :font}}>
            <AccountDropdown firstName={props.firstName} lastName={props.lastName} className="pl-5 align-right"></AccountDropdown>
          </div>
        </Toolbar>
        
      </AppBar >
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}

      >
        <div className={classes.toolbar} style={{'backgroundColor' :'#f1f1f1' }}>
        <Typography variant="h6" className ='pr-4' noWrap >
        <img src={props.imageBlob}  width="auto" height="45px" style={{"borderRadius": "5px"}} alt="waiter" /> 
           {/*<i>{props.restName}</i>*/}
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <MenuIcon /> : <MenuIcon />}
          </IconButton>
        </div>
        <Divider />
        <List >
          <ListItem button component="a" href ='/manager' >
						<ListItemIcon><StatsIcon/></ListItemIcon>
						<ListItemText disableTypography primary="Statistics" style={{'fontFamily' :font, 'fontSize': '1.5em'}}/>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button component="a" href ='/menu'>
						<ListItemIcon><RestaurantMenuIcon/></ListItemIcon>
						<ListItemText disableTypography primary="Menu"  style={{'fontFamily' :font, 'fontSize': '1.5em'}}/>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button component="a" href ='/general' >
            <ListItemIcon><GeneralIcon/></ListItemIcon>
            <ListItemText disableTypography primary="General"  style={{'fontFamily' :font, 'fontSize': '1.5em'}}/>
          </ListItem>
        </List>
				<Divider />
        <List>
          <ListItem button component="a" href ='/customize'>
            <ListItemIcon><CustomIcon/></ListItemIcon>
            <ListItemText disableTypography primary="Customize"  style={{'fontFamily' :font, 'fontSize': '1.5em'}}/>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button component="a" href ='/QRCode'>
            <ListItemIcon><CropFreeIcon/></ListItemIcon>
            <ListItemText disableTypography primary="QR Code Generator"  style={{'fontFamily' :font, 'fontSize': '1.5em'}}/>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button component="a" href ='/cookview'>
            <ListItemIcon><StaffIcon/></ListItemIcon>
            <ListItemText disableTypography primary="Staff"  style={{'fontFamily' :font, 'fontSize': '1.5em'}}/>
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content} style={{'backgroundColor':'#fffffff'}}>
        <div className={classes.toolbar} />
        <Switch>
          <Route exact path="/manager">
            <Stats primary ={primary} font_color = {font_color} font ={font} />
          </Route>
          <Route path="/menu">
            <Menu name = {props.restaurantInfo[1][1]} menu = {props.restaurantInfo[0][1]} primary ={primary}  secondary ={secondary}  tertiary ={tertiary}  font_color = {font_color} font ={font} />
          </Route>
          <Route path="/general">
            <StoreInfo info = {props.restaurantInfo[1][1]} primary ={primary}  secondary ={secondary}  tertiary ={tertiary}  font_color = {font_color} font ={font}  />
          </Route>
          <Route path="/customize">
            <Customize info = {props.restaurantInfo[1][1]} logo = {props.imageBlob} primary ={primary}  secondary ={secondary}  tertiary ={tertiary}  font_color = {font_color} font ={font} />
          </Route>
          <Route path="/cookview">
            <CookView primary ={primary}  secondary ={secondary}  tertiary ={tertiary}  font_color = {font_color} font ={font} />
          </Route>
				  <Route path="/QRCode">
					  <QRCode info = {props.restaurantInfo[1][1]} primary ={primary}  secondary ={secondary}  tertiary ={tertiary}  font_color = {font_color} font ={font} />
				  </Route>
          <Route path="/account">
            <AccountSettings primary ={primary}  secondary ={secondary}  tertiary ={tertiary}  font_color = {font_color} font ={font}/>
          </Route>
        </Switch>
        <footer className={classes.footerStyle}>
          Powered by AutoGarcon
          <img src={LogoImage} width="auto" height="50vh" alt="waiter" />
        </footer> 
      </main>
    </div>
  );
}

