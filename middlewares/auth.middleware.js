import userService from '../services/user.service.js';

const buildSessionUser = user => ({
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  commerceId: user.commerceId || null,
});

export const setAuthenticatedUser = (req, user) => {
  req.session.user = buildSessionUser(user);
};

export const clearAuthenticatedUser = req => {
  req.session.destroy(err => {
    if (err) console.error('Error al destruir sesion:', err);
  });
};

export const loadAuthUser = async (req, res, next) => {
  res.locals.currentUser = null;

  const storedUser = req.session?.user;
  if (!storedUser?.email) return next();

  try {
    const user = await userService.findByEmail(storedUser.email);

    if (!user || user.status !== 'Activo') {
      req.session.user = null;
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
  if (req.session?.user) return res.redirect('/');
  next();
};
