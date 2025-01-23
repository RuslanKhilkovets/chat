import {ONE_SIGNAL_APP_TOKEN, ONE_SIGNAL_APP_ID} from '@env';

const sendNotification = async (body: {
  playerIds: string[];
  title: string;
  message: string;
}) => {
  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${ONE_SIGNAL_APP_TOKEN}`,
      },
      body: JSON.stringify({
        app_id: ONE_SIGNAL_APP_ID,
        headings: {en: body.title},
        contents: {en: body.message},
        include_external_user_ids: body.playerIds,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Notification sent:', result);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export default sendNotification;
