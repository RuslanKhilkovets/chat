import ITimestamps from './ITimestamps';

export default interface IChat extends ITimestamps {
  _id: string;
  members: [string, string];
}
