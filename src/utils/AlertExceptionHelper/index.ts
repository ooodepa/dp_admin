import { NavigateFunction } from 'react-router-dom';

import HttpException from '../FetchBackend/HttpException';
import HttpResponseDto from '../FetchBackend/dto/http-response.dto';

export default function AlertExceptionHelper(exception: any) {
  try {
    if (
      exception instanceof TypeError &&
      exception.message === 'Network request failed'
    ) {
      let message = '';
      message += `Нет интернета (TypeError, message = 'Network request failed')`;
      message += '\n';
      message += `${exception}`;

      alert(message);
      return;
    }

    alert(exception);
  } catch (err) {
    alert(err);
  }
}

export async function AsyncAlertExceptionHelper(
  exception: any,
  navigate: NavigateFunction,
) {
  try {
    if (exception instanceof HttpException && exception.HTTP_STATUS === 401) {
      navigate('/login');
      return;
    }

    if (exception instanceof HttpException && exception.HTTP_STATUS === 403) {
      navigate('/login');
      alert('У вас нет роли администратора');
      return;
    }

    if (exception instanceof HttpException) {
      const json: HttpResponseDto = await exception.RESPONSE.json();

      let message = '';
      message += 'Запрос на сервер (HttpException) \n';
      message += '\n';
      message += `${json.message} \n`;
      message += '\n';
      message += 'Дополнительная информация: \n';
      message += `- Method: ${exception.HTTP_METHOD} \n`;
      message += `- URL: ${exception.HTTP_URL} \n`;
      message += `- HTTP status: ${exception.HTTP_STATUS} \n`;

      alert(message);
      return;
    }

    AlertExceptionHelper(exception);
  } catch (err) {
    if (exception instanceof HttpException) {
      let message = '';
      message += 'Запрос на сервер (HttpException) \n';
      message += '\n';
      message += 'Дополнительная информация: \n';
      message += `- Method: ${exception.HTTP_METHOD} \n`;
      message += `- URL: ${exception.HTTP_URL} \n`;
      message += `- HTTP status: ${exception.HTTP_STATUS} \n`;

      alert(message);
      return;
    }

    alert(err);
  }
}
