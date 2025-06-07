'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import RoofingIcon from '@mui/icons-material/Roofing';
import PeopleIcon from '@mui/icons-material/People'; 
import SecurityIcon from '@mui/icons-material/Security'; 
import PersonIcon from '@mui/icons-material/Person'; 
import LockIcon from '@mui/icons-material/Lock';
import DatasetIcon from '@mui/icons-material/Dataset';
import CategoryIcon from '@mui/icons-material/Category';


const PersonPage = dynamic(() => import('./person/page'), { ssr: false });
const UsersPage = dynamic(() => import('./users/page'), { ssr: false });
const ProfilePage = dynamic(() => import('./profile/page'), { ssr: false });
const RolePage = dynamic(() => import('./role/page'), { ssr: false });
const ServicePage = dynamic(() => import('./services/page'), { ssr: false });


const CategoryPage = dynamic(() => import('./category/page'), { ssr: false });
const IndexPage = dynamic(() => import('./page'), { ssr: false });

const NAVIGATION: Navigation = [
  {
    segment: 'person',
    title: 'person',
    icon: <PeopleIcon />, 
  },
  {
    segment: 'security',
    title: 'Security',
    icon: <SecurityIcon />, 
    children: [
      {
        segment: 'users',
        title: 'Users',
        icon: <PersonIcon />, 
      },
      {
        segment: 'profile',
        title: 'Profile',
        icon: <PersonIcon />, 
      },
      {
        segment: 'role',
        title: 'Role',
        icon: <LockIcon />, 
      },
    ],
  },
  {
    segment: 'masterData',
    title: 'Master Data',
    icon: <DatasetIcon /
    >,
    children: [
      {
        segment: 'category',
        title: 'Category',
        icon: <CategoryIcon />, 
      },
      {
        segment: 'services',
        title: 'Services',
        icon: <RoofingIcon />, 
      },
    ], 
  },
];


const getDesignTokens = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: '#90caf9',
            contrastText: '#fff',
          },
          secondary: {
            main: '#ce93d8', 
            contrastText: '#fff', 
          },
          background: {
            default: '#fff', 
            paper: '#f5f5f5', 
          },
          text: {
            primary: '#212121',
            secondary: '#757575', 
          },
        }
      : {
          // Paleta de colores para el tema oscuro
          primary: {
            main: '#5c6bc0',
            contrastText: '#fff', 
          },
          secondary: {
            main: '#ab47bc', 
            contrastText: '#fff', 
          },
          background: {
            default: '#121212', 
            paper: '#1e1e1e',
          },
          text: {
            primary: '#fff', 
            secondary: '#9e9e9e', 
          },
        }),
  },
});

const demoTheme = (mode: 'light' | 'dark') => createTheme(getDesignTokens(mode));

function DemoPageContent({ pathname }: { pathname: string }) {
  const segment = pathname.split('/').pop(); 

  switch (segment) {
    case 'services':
      return <ServicePage />;
    case 'category':
      return <CategoryPage />;
    case 'person':
      return <PersonPage />;
    case 'users':
      return <UsersPage />;
    case 'profile':
      return <ProfilePage />;
    case 'role':
      return <RolePage />;
    default:
      return <IndexPage />;
  }
}

interface DemoProps {
  window?: () => Window;
}

export default function DashboardLayoutBasic(props: DemoProps) {
  const { window } = props;
  const router = useDemoRouter('/dashboard');
  const demoWindow = window !== undefined ? window() : undefined;

  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const storedMode = localStorage.getItem('themeMode') as 'light' | 'dark' | null;
    if (storedMode) {
      setMode(storedMode);
    } else {
      const toolpadColorScheme = document.querySelector('[data-toolpad-color-scheme]')?.getAttribute('data-toolpad-color-scheme');
      setMode(toolpadColorScheme === 'dark' ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const nuevoTitulo = "El Nuevo Título de Mi Dashboard"; 
  console.log("Valor de la prop title que se pasa a DashboardLayout:", nuevoTitulo);

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      window={demoWindow}
    >
      <ThemeProvider theme={demoTheme(mode)}>
         <DashboardLayout title={nuevoTitulo} headerProps={{ color: 'secondary' }}>
          <DemoPageContent pathname={router.pathname} />
        </DashboardLayout>
      </ThemeProvider>
    </AppProvider>
  );
}