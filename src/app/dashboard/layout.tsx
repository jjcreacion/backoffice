'use client'

import AccountCircle from '@mui/icons-material/AccountCircle'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import CallIcon from '@mui/icons-material/Call'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { CircularProgress, Divider, Menu, MenuItem } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { ThemeProvider, styled, useTheme } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import darkTheme from '../styles/darkTheme'
import lightTheme from '../styles/lightTheme'
import menuItems from './components/dashboard/menuItems'

// Definir interfaces para los tipos de menú
interface SubMenuItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface MenuItem {
  label: string
  href?: string
  icon: React.ReactNode
  subItems?: SubMenuItem[]
}

const drawerWidth = 220
const collapsedWidth = 60
const transitionDuration = 300

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean
}>(({ theme, open }) => ({
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
  backgroundImage:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(to bottom, #303030, #424242)'
      : 'linear-gradient(to bottom, #f9f9f9, #F7F7F7)',
  ...(open && { [theme.breakpoints.up('sm')]: { marginLeft: drawerWidth } }),
  ...(!open && {
    [theme.breakpoints.up('sm')]: { marginLeft: collapsedWidth },
  }),
}))

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundImage:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(to bottom, #303030, #424242)'
      : 'linear-gradient(to bottom, #f9f9f9, #F7F7F7)',
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
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}))

const GradientDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    width: open ? drawerWidth : collapsedWidth,
    backgroundImage:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(to bottom, #212121, #424242)'
        : 'linear-gradient(to bottom, #151524, #262645)',
    color: theme.palette.text.primary,
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
}))

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
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
    color: theme.palette.common.white,
    transition: theme.transitions.create('opacity', {
      duration: transitionDuration,
    }),
  },
}))

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface User {
  person?: {
    firstName?: string
    lastName?: string
  }
  username?: string
  email?: string
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const theme = useTheme()
  const [open, setOpen] = useState(true)
  const [openSubMenu, setOpenSubMenu] = useState<Record<string, boolean>>({})
  const [darkMode, setDarkMode] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const router = useRouter()

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost'
  const port = process.env.NEXT_PUBLIC_PORT || '3000'

  const handleClick = (label: string) => {
    setOpenSubMenu((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  const handleLogout = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    localStorage.removeItem('pkUser')
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('pkUser')
    delete axios.defaults.headers.common['Authorization']
    router.push('/')
  }, [router])

  useEffect(() => {
    const checkAuth = async () => {
      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')
      const userData =
        localStorage.getItem('user') || sessionStorage.getItem('user')

      if (!token) {
        router.replace('/')
        return
      }

      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        if (userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        } else {
          const pkUser =
            localStorage.getItem('pkUser') || sessionStorage.getItem('pkUser')
          if (pkUser) {
            const response = await axios.get(
              `${baseUrl}:${port}/user/findOne/${pkUser}`
            )
            setUser(response.data)
            const storage = localStorage.getItem('access_token')
              ? localStorage
              : sessionStorage
            storage.setItem('user', JSON.stringify(response.data))
          }
        }
      } catch (error) {
        console.error('Auth verification failed:', error)
        handleLogout()
        return
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router, baseUrl, port, handleLogout])

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const toggleMenu = () => {
    setOpen(!open)
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #36454F 0%, #B22222 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    )
  }

  const getUserDisplayName = (): string => {
    if (!user) return 'User'

    if (user.person) {
      const { firstName, lastName } = user.person
      if (firstName && lastName) {
        return `${firstName} ${lastName}`
      }
      if (firstName) return firstName
      if (lastName) return lastName
    }

    if (user.username) return user.username
    if (user.email) return user.email.split('@')[0]

    return 'Usuario'
  }

  // Tipar explícitamente menuItems para evitar el error de TypeScript
  const typedMenuItems = menuItems as MenuItem[]

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Box sx={{ display: 'flex' }}>
        <AppBarStyled position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                mr: 2,
                ...(open && { display: { xs: 'block', sm: 'none' } }),
              }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Link
                href="/dashboard"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                >
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

            <Typography sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
              {getUserDisplayName()}
            </Typography>

            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
              <AccountCircle />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleProfileMenuClose}>
                <AccountCircle sx={{ mr: 1 }} />
                My Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>

            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBarStyled>

        <GradientDrawer variant="permanent" open={open}>
          <DrawerHeader sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={toggleMenu}>
              {open ? (
                <ChevronLeftIcon sx={{ color: theme.palette.common.white }} />
              ) : (
                <MenuIcon sx={{ color: theme.palette.common.white }} />
              )}
            </IconButton>
            {open && (
              <Box
                sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}
              >
                <Link
                  href="/dashboard"
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    height: 'auto',
                  }}
                >
                  <Image
                    src="/images/icon-tnb.png"
                    alt="TNB Logo"
                    height={20}
                    width={50}
                    style={{ display: 'block' }}
                  />
                </Link>
              </Box>
            )}
          </DrawerHeader>

          <List>
            {typedMenuItems.map((item) => (
              <React.Fragment key={item.label}>
                <ListItem disablePadding sx={{ display: 'block' }}>
                  {item.href ? (
                    <Link href={item.href} style={{ textDecoration: 'none' }}>
                      <StyledListItemButton
                        onClick={
                          item.subItems ? () => handleClick(item.label) : undefined
                        }
                        open={open}
                      >
                        <ListItemIcon sx={{ mr: open ? 3 : 'auto' }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                        {item.subItems &&
                          open &&
                          (openSubMenu[item.label] ? (
                            <ExpandLess
                              sx={{ color: theme.palette.common.white }}
                            />
                          ) : (
                            <ExpandMore
                              sx={{ color: theme.palette.common.white }}
                            />
                          ))}
                      </StyledListItemButton>
                    </Link>
                  ) : (
                    <StyledListItemButton
                      onClick={
                        item.subItems ? () => handleClick(item.label) : undefined
                      }
                      open={open}
                    >
                      <ListItemIcon sx={{ mr: open ? 3 : 'auto' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.label} />
                      {item.subItems &&
                        open &&
                        (openSubMenu[item.label] ? (
                          <ExpandLess
                            sx={{ color: theme.palette.common.white }}
                          />
                        ) : (
                          <ExpandMore
                            sx={{ color: theme.palette.common.white }}
                          />
                        ))}
                    </StyledListItemButton>
                  )}
                </ListItem>
                {item.subItems && open && (
                  <Collapse
                    in={openSubMenu[item.label]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem) => (
                        <ListItem key={subItem.label} disablePadding>
                          <Link href={subItem.href} style={{ textDecoration: 'none', width: '100%' }}>
                            <StyledListItemButton
                              sx={{ pl: 4 }}
                              open={open}
                            >
                              <ListItemIcon sx={{ mr: open ? 3 : 'auto' }}>
                                {subItem.icon}
                              </ListItemIcon>
                              <ListItemText primary={subItem.label} />
                            </StyledListItemButton>
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            ))}
          </List>
        </GradientDrawer>

        <Main open={open}>{children}</Main>
      </Box>
    </ThemeProvider>
  )
}

export default DashboardLayout