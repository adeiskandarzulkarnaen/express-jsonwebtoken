
class AuthenticationError extends Error {
  public readonly status: number;
  constructor(message: string){
    super(message);
    this.status = 401;
    this.name = 'AuthenticationError';
  }
}

export default AuthenticationError;
