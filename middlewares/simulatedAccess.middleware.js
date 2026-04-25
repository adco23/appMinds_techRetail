const parseCookies = cookieHeader => {
  if (!cookieHeader) return {};

  return cookieHeader.split(";").reduce((acc, item) => {
    const [rawKey, ...rawValue] = item.trim().split("=");
    if (!rawKey) return acc;

    acc[decodeURIComponent(rawKey)] = decodeURIComponent(rawValue.join("="));
    return acc;
  }, {});
};

const buildNavigation = simulatedUser => {
  if (simulatedUser.isPlatformAdmin) {
    return [
      { label: "Usuarios", href: "/users" },
      { label: "Comercios", href: "/commerces" },
      { label: "Ordenes", href: "/orders" },
      { label: "Suscripciones", href: "/subscriptions" },
      { label: "Tiendas", href: "/stores/view" },
      { label: "Transacciones", href: "/transactions" },
      { label: "Productos", href: "/products/view" },
    ];
  }

  if (simulatedUser.isCommerceAdmin) {
    if (!simulatedUser.subscriptionPaid) {
      return [{ label: "Activar Suscripción", href: "/commerce-admin/subscription" }];
    }

    return [
      { label: "Ordenes", href: "/orders" },
      { label: "Suscripcion", href: "/commerce-admin/subscription" },
      { label: "Tiendas", href: "/stores/view" },
      { label: "Transacciones", href: "/transactions" },
      { label: "Productos", href: "/products/view" },
    ];
  }

  return [];
};

const attachSimulatedAccess = (req, res, next) => {
  const cookies = parseCookies(req.headers.cookie);
  const role = cookies.simulatedRole || "guest";
  const subscriptionPaid = cookies.subscriptionPaid === "true";

  req.simulatedUser = {
    role,
    subscriptionPaid,
    isPlatformAdmin: role === "platform-admin",
    isCommerceAdmin: role === "commerce-admin",
  };

  res.locals.simulatedUser = req.simulatedUser;
  res.locals.navigationModules = buildNavigation(req.simulatedUser);

  next();
};

const requirePlatformAdmin = (req, res, next) => {
  if (req.simulatedUser.isPlatformAdmin) {
    return next();
  }

  return res.redirect("/?denied=platform-only");
};

const requireCommerceSubscription = (req, res, next) => {
  if (!req.simulatedUser.isCommerceAdmin) {
    return next();
  }

  if (req.simulatedUser.subscriptionPaid) {
    return next();
  }

  return res.redirect("/commerce-admin/subscription?required=1");
};

module.exports = {
  attachSimulatedAccess,
  requirePlatformAdmin,
  requireCommerceSubscription,
};
