import SInfo from 'react-native-sensitive-info';

const PIN_KEY = 'pin_code';
const OPTIONS = {
  sharedPreferencesName: 'preferences',
  keychainService: 'keychainService',
};

export async function savePin(pin: string): Promise<void> {
  await SInfo.setItem(PIN_KEY, pin, OPTIONS);
}

export async function getPin(): Promise<string | null> {
  return await SInfo.getItem(PIN_KEY, OPTIONS);
}

export async function removePin(): Promise<void> {
  await SInfo.deleteItem(PIN_KEY, OPTIONS);
}

export default {savePin, getPin, removePin};
