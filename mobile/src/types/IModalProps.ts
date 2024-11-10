export default interface IModalProps extends React.PropsWithChildren {
  visible: boolean;
  onClose: () => void;
  title?: string;
  openFrom?: 'left' | 'right' | 'top' | 'bottom';
  headerBgColor?: string;
}
