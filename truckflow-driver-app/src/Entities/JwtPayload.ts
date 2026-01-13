export default interface JwtPayload {
  UserId: string;
  MotoristaId: string;
  role: string;
  email: string;
  unique_name: string;
  exp: number;
}