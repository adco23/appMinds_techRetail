const normalizeRole = role => {
  if (role === 'platform-admin' || role === 'commerce-admin') return role;
  if (role === 'admin') return 'platform-admin';
  if (role === 'vendedor') return 'commerce-admin';
  return '';
};

const buildSimulationData = req => {
  const authenticatedUser = req.session?.user || null;
  const userRole = normalizeRole(authenticatedUser?.role || '');
  const queryRole = normalizeRole(req.query.role || '');
  const role = queryRole || userRole;

  const subscribed = req.query.subscribed === '1' || authenticatedUser?.hasSubscription === true;

  return {
    role,
    subscribed,
    isPlatformAdmin: role === 'platform-admin',
    isCommerceAdmin: role === 'commerce-admin',
    query: role ? `?role=${role}${subscribed ? '&subscribed=1' : ''}` : '',
  };
};

export const loadSimulation = (req, res, next) => {
  const sim = buildSimulationData(req, res);

  res.locals.sim = sim;
  req.simulation = sim;

  if (
    (req.path.startsWith('/stores') || req.path.startsWith('/products')) &&
    sim.isCommerceAdmin &&
    !sim.subscribed
  ) {
    return res.redirect('/commerce-admin/subscription?role=commerce-admin');
  }

  next();
};

export const getSimulationData = req => {
  return req.simulation || buildSimulationData(req);
};

export const onlyPlatformAdmin = (req, res, next) => {
  const sim = getSimulationData(req);

  if (!sim.isPlatformAdmin) {
    return res.redirect('/');
  }

  req.simulation = sim;
  next();
};

export const commerceNeedsSubscription = (req, res, next) => {
  const sim = getSimulationData(req);

  if (sim.isCommerceAdmin && !sim.subscribed) {
    return res.redirect('/commerce-admin/subscription?role=commerce-admin');
  }

  req.simulation = sim;
  next();
};
