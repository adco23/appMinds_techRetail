import Subscription from "../models/subscription.model.js";

const getAll = async () => {
  return await Subscription.find();
};

const crear = async data => {
  const hoy = new Date();
  const startDate = hoy.toISOString().split('T')[0];
  const vencimiento = new Date();
  vencimiento.setDate(hoy.getDate() + 30);
  const expDate = vencimiento.toISOString().split('T')[0];

  const nuevaSub = new Subscription({
    detail:  data.detail,
    amount:  Number(data.amount),
    startDate,
    expDate,
    status:  'active',
    storeId: data.storeId,
  });

  return await nuevaSub.save();
};

const renovar = async id => {
  const sub = await Subscription.findById(id);
  if (!sub) throw new Error('Suscripción no encontrada');

  const currentExp = new Date(sub.expDate);
  currentExp.setDate(currentExp.getDate() + 30);

  sub.expDate = currentExp.toISOString().split('T')[0];
  sub.status  = 'active';

  await commerceService.activateCommerce(sub.storeId);

  return await sub.save();
};

const cancelar = async id => {
  const sub = await Subscription.findById(id);
  if (!sub) throw new Error('Suscripción no encontrada');

  sub.status = 'cancelled';
  return await sub.save();
};

export default { getAll, crear, renovar, cancelar };
