import {
  AboutScreen,
  ChangePersonalDataScreen,
  ChatScreen,
  ChatsScreen,
  FindUsersScreen,
  PrivacyPoliciesScreen,
  ProfileScreen,
  SettingsScreen,
} from '@/screens';
import {IRoute} from '@/types';

export const privateRoutes: IRoute[] = [
  {
    name: 'Chats',
    component: ChatsScreen,
  },
  {
    name: 'Settings',
    component: SettingsScreen,
  },
  {
    name: 'Profile',
    component: ProfileScreen,
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
  {
    name: 'PrivacyPolicies',
    component: PrivacyPoliciesScreen,
  },
  {
    name: 'ChangePersonalData',
    component: ChangePersonalDataScreen,
  },
];

export default privateRoutes;
