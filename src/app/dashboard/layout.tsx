'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Link from 'next/link';
import { styled, useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CallIcon from '@mui/icons-material/Call';
import Image from 'next/image';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Switch } from '@mui/material';
import lightTheme from '../styles/lightTheme';
import darkTheme from '../styles/darkTheme';
import menuItems from './components/dashboard/menuItems';

const drawerWidth = 220;
const collapsedWidth = 60;
const transitionDuration = 0.3;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    paddingTop: theme.spacing(8),
    height: '100vh',
    minHeight: '100vh',
    backgroundImage: theme.palette.mode === 'dark' ? 'linear-gradient(to bottom, #303030, #424242)' : 'linear-gradient(to bottom, #f9f9f9, #F7F7F7)',
    ...(open && { [theme.breakpoints.up('sm')]: { marginLeft: drawerWidth } }),
    ...(!open && { [theme.breakpoints.up('sm')]: { marginLeft: collapsedWidth } }),
  })
);

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundImage: theme.palette.mode === 'dark' ? 'linear-gradient(to bottom, #303030, #424242)' : 'linear-gradient(to bottom, #f9f9f9, #F7F7F7)',
  color: theme.palette.text.secondary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[1],
  ...(open && {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
    },
  }),
  ...(!open && {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${collapsedWidth}px)`,
      marginLeft: `${collapsedWidth}px`,
    },
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

//Estilos del menu
const GradientDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      width: open ? drawerWidth : collapsedWidth,
      backgroundImage: theme.palette.mode === 'dark' ? 'linear-gradient(to bottom, #212121, #424242)' : 'linear-gradient(to bottom, #151524, #262645)',
      color: theme.palette.text.contrast,
      borderRight: `5px solid ${theme.palette.divider}`,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      [theme.breakpoints.up('sm')]: {
        width: open ? drawerWidth : collapsedWidth,
      },
    },
  })
);


const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  justifyContent: open ? 'initial' : 'center',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  marginBottom: theme.spacing(0.5),
  borderRadius: '8px',
  transition: theme.transitions.create(['background-color', 'transform'], { 
    duration: transitionDuration,
  }),
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    transform: 'translateX(10px)',
    '& .MuiListItemIcon-root': {
      color: theme.palette.text.primary,
    },
    '& .MuiListItemText-root': {
      color: theme.palette.text.primary,
    },
    '& .MuiTypography-root': { 
      fontWeight: 'bold',
    },
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: open ? theme.spacing(3) : 'auto',
    justifyContent: 'center',
    color: theme.palette.common.white,
    transition: theme.transitions.create('margin-right', {
      duration: transitionDuration,
    }),
  },
  '& .MuiListItemText-root': {
    opacity: open ? 1 : 0,
    color: theme.palette.text.contrast, 
    transition: theme.transitions.create('opacity', {
      duration: transitionDuration,
    }),
  },
}));

const DashboardLayout = ({ children }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [openSubMenu, setOpenSubMenu] = useState({});
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = (label) => {
    setOpenSubMenu({ ...openSubMenu, [label]: !openSubMenu[label] });
  };

  const toggleMenu = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme} >
      <Box sx={{ display: 'flex' }}>
        <AppBarStyled position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: { xs: 'block', sm: 'none' } }) }}
            >
            </IconButton>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  TNB - WorkSpaces
                </Typography>
              </Link>
            </Box>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit">
              <CallIcon sx={{ mr: { xs: 0, sm: 1 } }} />
            </IconButton>
            <Typography sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>Johann Gonzalez</Typography>
            <IconButton color="inherit">
              <AccountCircle />
            </IconButton>
            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBarStyled>
        <GradientDrawer variant="permanent" open={open}>
          <DrawerHeader sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={toggleMenu}>
              {open ? <ChevronLeftIcon sx={{ color: theme.palette.common.white }} /> : <MenuIcon sx={{ color: theme.palette.common.white }} />}
            </IconButton>
            {open && (
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', height: 'auto' }}>
                  <Image
                    src="/images/icon-tnb.png"
                    alt="ServiFy Logo"
                    height={20}
                    width={50}
                    style={{ display: 'block' }}
                  />
                </Link>
              </Box>
            )}
          </DrawerHeader>
          <List>
            {menuItems.map((item) => (
              <React.Fragment key={item.label}>
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <StyledListItemButton
                    component={item.href ? Link : 'div'}
                    href={item.href}
                    onClick={item.subItems ? () => handleClick(item.label) : undefined}
                    open={open}
                  >
                    <ListItemIcon sx={{ mr: open ? 3 : 'auto' }}> 
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                    {item.subItems && open && (openSubMenu[item.label] ? <ExpandLess sx={{ color: theme.palette.common.white }} /> : <ExpandMore sx={{ color: theme.palette.common.white }} />)}
                  </StyledListItemButton>
                </ListItem>
                {item.subItems && open && (
                  <Collapse in={openSubMenu[item.label]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem) => (
                        <ListItem key={subItem.label} disablePadding>
                          <StyledListItemButton
                            component={Link}
                            href={subItem.href}
                            sx={{ pl: 4 }}
                            open={open}
                          >
                            <ListItemIcon sx={{ mr: open ? 3 : 'auto' }}> 
                              {subItem.icon}
                            </ListItemIcon>
                            <ListItemText primary={subItem.label} />
                          </StyledListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            ))}
          </List>
        </GradientDrawer>
        <Main open={open}>
          {children}
        </Main>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;