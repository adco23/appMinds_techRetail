import userService from '../services/user.service.js';
import subscriptionService from '../services/subscription.service.js';

const buildSessionUser = (user, hasSubscription = false) => ({
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  commerceId: user.commerceId || null,
  hasSubscription,
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

    const hasSubscription = user.role === 'commerce-admin'
      ? await subscriptionService.hasActiveSubscriptionForCommerce(user.commerceId)
      : false;

    const sessionUser = buildSessionUser(user, hasSubscription);
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
