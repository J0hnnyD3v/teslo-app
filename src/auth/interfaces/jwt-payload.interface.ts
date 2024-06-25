export interface IJwtPayload {
  id: string;
  email: string;
  fullName: string;
  iat?: number;
  exp?: number;
}
