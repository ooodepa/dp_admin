import HttpException from './HttpException';
import UpdateSessionResponseDto from './rest/api/sessions/dto/update-session-response.dto';

async function update() {
  const refreshToken = localStorage.getItem('refresh');

  if (!refreshToken) {
    throw new Error('Войдите в аккаунт');
  }

  const URL = `${process.env.REACT_APP__BACKEND_URL}/api/v1/sessions`;

  console.log({ method: 'PATCH', URL });

  const response = await fetch(URL, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (response.status === 200) {
    const json: UpdateSessionResponseDto = await response.json();
    localStorage.setItem('access', json.dp_accessToken);
    return true;
  }

  if (response.status === 401) {
    throw new HttpException('PATCH', response);
  }

  throw new HttpException('PATCH', response);
}

interface FetchBackendResult {
  response: Response;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

export default async function FetchBackend(
  type: 'none' | 'access' | 'refresh',
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  uri: string,
  body: any | undefined = {},
): Promise<FetchBackendResult> {
  const token: string | undefined =
    type === 'access'
      ? `Bearer ${localStorage.getItem('access')}`
      : type === 'refresh'
      ? `Bearer ${localStorage.getItem('refresh')}`
      : undefined;

  const URL = `${process.env.REACT_APP__BACKEND_URL}/api/v1/${uri}`;

  // eslint-disable-next-line no-console
  console.log({ method, URL, isUseAccessToken: type === 'access' });

  if (method === 'GET') {
    const response = await fetch(URL, {
      headers: token ? { Authorization: token } : {},
    });

    if (response.status === 401) {
      await update();
      const token: string | undefined =
        type === 'access'
          ? `Bearer ${localStorage.getItem('access')}`
          : undefined;
      const response2 = await fetch(URL, {
        headers: token ? { Authorization: token } : {},
      });
      return { response: response2, method };
    }

    return { response, method };
  }

  if (method === 'POST') {
    const BODY = JSON.stringify(body);
    const HEADERS = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await fetch(URL, {
      method: 'POST',
      body: BODY,
      headers: token ? { ...HEADERS, Authorization: token } : HEADERS,
    });

    if (response.status === 401) {
      await update();
      const token: string | undefined =
        type === 'access'
          ? `Bearer ${localStorage.getItem('access')}`
          : undefined;
      const response2 = await fetch(URL, {
        method: 'POST',
        body: BODY,
        headers: token ? { ...HEADERS, Authorization: token } : HEADERS,
      });
      return { response: response2, method };
    }

    return { response, method };
  }

  if (method === 'PUT') {
    const BODY = JSON.stringify(body);
    const HEADERS = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await fetch(URL, {
      method: 'PUT',
      body: BODY,
      headers: token ? { ...HEADERS, Authorization: token } : HEADERS,
    });

    if (response.status === 401) {
      await update();
      const token: string | undefined =
        type === 'access'
          ? `Bearer ${localStorage.getItem('access')}`
          : undefined;
      const response2 = await fetch(URL, {
        method: 'PUT',
        body: BODY,
        headers: token ? { ...HEADERS, Authorization: token } : HEADERS,
      });
      return { response: response2, method };
    }

    return { response, method };
  }

  if (method === 'PATCH') {
    const BODY = JSON.stringify(body);
    const HEADERS = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const response = await fetch(URL, {
      method: 'PATCH',
      body: BODY,
      headers: token ? { ...HEADERS, Authorization: token } : HEADERS,
    });

    if (response.status === 401) {
      await update();
      const token: string | undefined =
        type === 'access'
          ? `Bearer ${localStorage.getItem('access')}`
          : undefined;
      const response2 = await fetch(URL, {
        method: 'PATCH',
        body: BODY,
        headers: token ? { ...HEADERS, Authorization: token } : HEADERS,
      });
      return { response: response2, method };
    }

    return { response, method };
  }

  const HEADERS = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const response = await fetch(URL, {
    method: 'DELETE',
    headers: token ? { ...HEADERS, Authorization: token } : HEADERS,
  });

  if (response.status === 401) {
    await update();
    const token: string | undefined =
      type === 'access'
        ? `Bearer ${localStorage.getItem('access')}`
        : undefined;
    const response2 = await fetch(URL, {
      method: 'DELETE',
      headers: token ? { ...HEADERS, Authorization: token } : HEADERS,
    });
    return { response: response2, method };
  }

  return { response, method };
}
