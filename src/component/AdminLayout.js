import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
  Drawer, AppBar, Toolbar, List, CssBaseline, Typography, Divider,
  IconButton, ListItem, ListItemIcon, ListItemText, Collapse, Popover, Button, Link
} from '@material-ui/core';
import {
  Home, Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon,
  ExpandLess as IconExpandLess, ExpandMore as IconExpandMore, Web as WebIcon, MoveToInbox as InboxIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon, WebAsset
} from '@material-ui/icons';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { loginUserSuccess } from '../redux/actions/LoginActions'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuItem: {
    width: drawerWidth,
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
    height: "5.35em",
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  typography: {
    padding: theme.spacing(2),
    cursor: "default",
  },
  activeListItem: {
    borderLeft: `4px solid ${"lightgrey"}`,
    borderRadius: '4px',
    backgroundColor: "lightgrey",
    '& $listItemText': {
      color: theme.palette.text.primary
    },
    '& $listItemIcon': {
      color: theme.palette.primary.main,
      marginLeft: '-4px'
    }
  }
}));

export default function AdminLayout(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const history = useHistory()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.login.data)

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const openAnchor = Boolean(anchorEl);
  const id = openAnchor ? 'simple-popover' : undefined;

  function handleClick() {
    setOpen1(!open1)
  }

  function handleClick2() {
    setOpen2(!open2)
  }

  const handleClickAnchor = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAnchor = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    localStorage.clear()
    let obj = {}
    dispatch(loginUserSuccess(obj))
    history.push('/')
  }
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        color="#1DABB8"
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar style={{ color: "#1DABB8" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap style={{ flex: 1 }}>
            {props.title}
          </Typography>
          <div>
            <img src="/humanavtar.jpg" height="75em" aria-describedby={id} variant="contained" style={{ color: "grey" }} onClick={handleClickAnchor} />
            <Button className="btn text-white" style={{ borderRadius: "6px", backgroundColor: "#1DABB8" }} onClick={() => { logout() }}>Logout</Button>
          </div>
        </Toolbar>
      </AppBar>
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
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>

          {user.type != "ADMIN" &&
            <ListItem button component={NavLink} to="/recentWebTemplate" className={classes.menuItem} activeClassName={classes.activeListItem}>
              <ListItemIcon className={classes.menuItemIcon}>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Recent" />
            </ListItem>
          }
          {/* <Collapse in={open1} timeout="auto" unmountOnExit>
        <Divider />
        <List component="div" disablePadding>
          <ListItem >
          <ListItemIcon className={classes.menuItemIcon}>
          <WebAssetIcon />
        </ListItemIcon>
            <ListItemText primary="Template" />
          </ListItem>
          <ListItem button component={NavLink} to="/recentPageTemplate" className={classes.menuItem}>
          <ListItemIcon className={classes.menuItemIcon}>
          <PageviewIcon />
        </ListItemIcon>
            <ListItemText primary="Web Page" />
          </ListItem>
        </List>
      </Collapse> */}

          <ListItem button component={NavLink} to="/savedWebTemplate" className={classes.menuItem} activeClassName={classes.activeListItem}>
            <ListItemIcon selected={true} className={classes.menuItemIcon}>
              <WebIcon />
            </ListItemIcon>
            <ListItemText primary="Template" />
          </ListItem>


          {user.type == "ADMIN" &&
            <ListItem button component={NavLink} to="/savedPages" className={classes.menuItem} activeClassName={classes.activeListItem}>
              <ListItemIcon selected={true} className={classes.menuItemIcon}>
                <WebAsset />
              </ListItemIcon>
              <ListItemText primary="Default Page" />
            </ListItem>
          }
          {/* <Collapse in={open2} timeout="auto" unmountOnExit>
        <Divider />
        <List component="div" disablePadding>
          <ListItem button component={NavLink} to="/savedWebTemplate" className={classes.menuItem}>
          <ListItemIcon className={classes.menuItemIcon}>
          <WebAssetIcon />
        </ListItemIcon>
          <ListItemText primary="Template" />
          </ListItem>
          <ListItem button component={NavLink} to="/savedPageTemplate" className={classes.menuItem}>
          <ListItemIcon className={classes.menuItemIcon}>
          <PageviewIcon />
        </ListItemIcon>
            <ListItemText primary="Web Page" />
          </ListItem>
        </List>
      </Collapse> */}

        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div>
          {props.children}
        </div>
      </main>
      <Popover
        id={id}
        open={openAnchor}
        anchorEl={anchorEl}
        onClose={handleCloseAnchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography className={classes.typography} onClick={() => { history.push('/updateProfile') }}>User-Profile</Typography>
      </Popover>
    </div>
  );
}

AdminLayout.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  width: PropTypes.string.isRequired
};
