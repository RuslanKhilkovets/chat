import {
  AboutScreen,
  ChatScreen,
  ChatsScreen,
  FindUsersScreen,
  ProfileScreen,
  ThemeScreen,
} from '@/screens';
import SavedScreen from '@/screens/SavedScreen';
import {IRoute} from '@/types';

export const privateRoutes: IRoute[] = [
  {
    name: 'Chats',
    component: ChatsScreen,
  },
  {
    name: 'Profile',
    component: ProfileScreen,
  },
  {
    name: 'Theme',
    component: ThemeScreen,
  },
  {
    name: 'Saved',
    component: SavedScreen,
  },
  {
    name: 'About',
    component: AboutScreen,
  },
  {
    name: 'Chat',
    component: ChatScreen,
  },
  {
    name: 'FindUsers',
    component: FindUsersScreen,
  },
];

export default privateRoutes;
