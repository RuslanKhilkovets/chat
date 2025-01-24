import ITimestamps from './ITimestamps';

export default interface IMessage extends ITimestamps {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
  messageType: 'text' | 'audio';
  isRead: boolean;
}
