import { Request, Response, NextFunction } from 'express';
import { TokenExpiredError, Algorithm, JwtPayload, verify } from 'jsonwebtoken';
import AuthenticationError from './errors/AuthenticationError';


/**
 * The Express Request including the "auth" property with the decoded JWT payload.
 */
export type JWTRequest<T = JwtPayload | string> = Request & { auth?: T };


export type jwtAuthOption = {
  secret: string;
  algorithms: Algorithm[],
  invalidAuthenticationHeaderMessage?: string,
  noAuthenticationHeaderMessage?: string,
  tokenExpireMessage?: string,
  tokenFailureVerificationMessage?: string,
}

export function expressJwt(options: jwtAuthOption) {
  if (!options || !options.secret) {
    throw new Error('JWT auth middleware requires options for "secret"');
  };

  return (req: JWTRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    let token;

    if (authorization) {
      const parts = authorization.split(/\s+/);
      if (parts.length !== 2) {
        throw new AuthenticationError(options.invalidAuthenticationHeaderMessage || 'invalid credentials structure: "Bearer xxx"');
      }
      token = parts[1];
    };

    if (!token) {
      throw new AuthenticationError(options.noAuthenticationHeaderMessage || 'no authorization included in request');
    };

    let decodedToken: JwtPayload | string;;
    try {
      decodedToken = verify(token, options.secret, { algorithms: options.algorithms });
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new AuthenticationError(options.tokenExpireMessage || 'authentication token expire');
      } else {
        throw new AuthenticationError(options.tokenFailureVerificationMessage || 'token verification failure');
      }
    }
    req.auth = decodedToken;
    next();
  };
};


export default expressJwt;
