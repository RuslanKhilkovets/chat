import {LoginScreen, RegisterScreen, StartScreen} from '@/screens';
import {IRoute} from '@/types';

export const publicRoutes: IRoute[] = [
  {
    name: 'Start',
    component: StartScreen,
  },
  {
    name: 'Login',
    component: LoginScreen,
  },
  {
    name: 'Register',
    component: RegisterScreen,
  },
];

export default publicRoutes;
