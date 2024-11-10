export const baseUrl: string = 'https://chat-88wq.onrender.com/api';

export const postRequest = async (url, body) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
  const data = await response.json();

  if (!response.ok) {
    return {
      error: true,
      message: data?.message,
    };
  }
  return data;
};

export const getRequest = async (url: string) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();

  if (!response.ok) {
    let message: string = 'An error occurred...';

    if (data?.message) {
      message = data.message;
    }
    return { error: true, message };
  }
  return data;
};
