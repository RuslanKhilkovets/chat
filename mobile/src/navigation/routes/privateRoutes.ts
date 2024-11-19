import {
  AboutScreen,
  ChangePersonalDataScreen,
  ChatScreen,
  ChatsScreen,
  FindUsersScreen,
  LanguageScreen,
  NotificationsScreen,
  PrivacyPoliciesScreen,
  ProfileScreen,
  SavedScreen,
  SecurityScreen,
  ThemeScreen,
} from '@/screens';
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
  {
    name: 'PrivacyPolicies',
    component: PrivacyPoliciesScreen,
  },
  {
    name: 'ChangePersonalData',
    component: ChangePersonalDataScreen,
  },
  {
    name: 'Language',
    component: LanguageScreen,
  },
  {
    name: 'Security',
    component: SecurityScreen,
  },
  {
    name: 'Notifications',
    component: NotificationsScreen,
  },
];

export default privateRoutes;
