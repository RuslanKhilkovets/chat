import {createIconSetFromFontello} from 'react-native-vector-icons';
import {IconProps} from 'react-native-vector-icons/Icon';

import fontelloConfig from '@/config/icons-config.json';

const Icon = createIconSetFromFontello(fontelloConfig);

export const AppIcon = ({
  color = '#000',
  name,
  size = 20,
  ...props
}: IconProps) => {
  return <Icon name={name} size={size} color={color} {...props} />;
};

export default AppIcon;
