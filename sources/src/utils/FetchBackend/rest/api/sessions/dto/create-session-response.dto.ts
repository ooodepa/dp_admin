export default interface CreateSessionResponseDto {
  statusCode: number;
  message: string;
  dp_accessToken: string;
  dp_refreshToken: string;
}
