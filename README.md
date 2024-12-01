# express-middleware-jwt

This module provides ExpressJs middleware to validate JWT via the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) module.

## Install

```
$ npm install express-middleware-jwt
```

## API

`authJwt(options)`

Options has the following parameters:

- `secret: jwt.Secret` (required): The secret as a string to retrieve the secret.
- `algorithms` (required): Specifies the algorithms to be used for token verification.
- `invalidAuthenticationHeaderMessage` (optional): A string defining the error message displayed when the authentication header is invalid.
- `noAuthenticationHeaderMessage` (optional):  A string defining the error message displayed when no authentication header is provided.
- `tokenExpireMessage` (optional): A string defining the error message displayed when the token has expired.
- `tokenFailureVerificationMessage` (optional): A string defining the error message displayed when token verification fails.


## Usage

Basic usage using an HS256 secret:

```javascript
import { authJwt } from 'express-middleware-jwt';

app.get(
  '/protected',
  authJwt({ secret: 'jwt_secret', algorithms: ['HS256'] }),
  (req, res) => {
    if (!req.auth.admin) return res.sendStatus(401);
    res.sendStatus(200);
  }
);
```

The decoded JWT payload is available on the request via the `auth` property.

### Required Parameters

The `algorithms` parameter is required to prevent potential downgrade attacks when providing third party libraries as **secrets**.

:warning: **Do not mix symmetric and asymmetric (ie HS256/RS256) algorithms**: Mixing algorithms without further validation can potentially result in downgrade vulnerabilities.

```javascript
authJwt({
  secret: 'jwt_secret',
  algorithms: ['HS256'],
  //algorithms: ['RS256']
});
```


## Typescript

A `JWTRequest` type is provided from `express-middleware-jwt`, which extends `express.Request` with the `auth` property. I

```typescript
import { Response } from 'express';
import { authJwt, JWTRequest } from 'express-middleware-jwt';

app.get(
  "/protected",
  authJwt({ secret: 'jwt_secret', algorithms: ['HS256'] }),
  function (req: JWTRequest, res: Response) {
    if (!req.auth?.admin) return res.sendStatus(401);
    res.sendStatus(200);
  }
);
```

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.