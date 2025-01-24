export default interface IUser extends ITimestamps {
  _id: string;
  email: string;
  name: string;
  phone: string;
  password: string;
  registerToken: string;
  playerId: string;
}
