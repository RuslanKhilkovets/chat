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
        Authorization: `Basic os_v2_app_hm6ylwcwgrc4hkky23ppfp674gbccf7gwmhutmmyzfkpkbyfqci5gqrcpcjgjsmqvsxl4556z7nb7ylcrjpqfix52ljkl7ydbxnx6uq`,
      },
      body: JSON.stringify({
        app_id: '3b3d85d8-5634-45c3-a958-d6def2bfdfe1',
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
