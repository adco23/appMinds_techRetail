import userService from '../services/user.service.js';

const buildSessionUser = user => ({
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  commerceId: user.commerceId || null,
});

export const setAuthenticatedUser = (req, user) => {
  req.app.locals.currentUser = buildSessionUser(user);
};

export const clearAuthenticatedUser = req => {
  req.app.locals.currentUser = null;
};

export const loadAuthUser = async (req, res, next) => {
  const storedUser = req.app.locals.currentUser;

  req.session = { user: null };
  res.locals.currentUser = null;

  if (!storedUser?.email) return next();

  try {
    const user = await userService.findByEmail(storedUser.email);

    if (!user || user.status !== 'Activo') {
      clearAuthenticatedUser(req);
      return next();
    }

    const sessionUser = buildSessionUser(user);
    req.session.user = sessionUser;
    res.locals.currentUser = sessionUser;
    next();
  } catch (error) {
    next(error);
  }
};

export const ensureAuthenticated = (req, res, next) => {
  if (req.session?.user) return next();

  const redirectTo = encodeURIComponent(req.originalUrl || '/');
  res.redirect(`/auth/login?redirect=${redirectTo}`);
};

export const ensureGuest = (req, res, next) => {
  if (req.session?.user) {
    return res.redirect('/');
  }

  next();
};
