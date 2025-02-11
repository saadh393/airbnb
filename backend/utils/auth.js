// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// backend/utils/auth.js
// ...

//! Sends a JWT Cookie =================================================================================================

const setTokenCookie = (res, user) => {

    // Create the token.

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const token = jwt.sign(
      { data: safeUser },
      secret,
      { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie

    res.cookie('token', token, {
      maxAge: expiresIn * 1000, // maxAge in milliseconds
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction && "Lax"
    });

    return token;
  };

//! Restore User Middleware ============================================================================================

//* For use in restoring session user for routes which require identity verification

// backend/utils/auth.js
// ...

const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (err) { // if the user is not logged in..
        return next(); // move to the next middleware. Error logging in does not mean we need to throw an error and halt code execution! It just means the user isn't logged in, which is fine.
      }

      try {
        const { id } = jwtPayload.data;
        req.user = await User.findByPk(id, {
          attributes: {
            include: ['email', 'createdAt', 'updatedAt']
          }
        });
      } catch (e) {
        res.clearCookie('token');
        return next();
      }

      if (!req.user) res.clearCookie('token');

      return next();
    });
  };

  // backend/utils/auth.js
// ...

//! RequireAuth Middleware =============================================================================================

//* If there is no current user, return an error

const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
}

// backend/utils/auth.js
// ...

module.exports = { setTokenCookie, restoreUser, requireAuth };
