import Subscription from "../models/subscription.model.js";
import Store from "../models/store.model.js";

export const getAll = async () => {
  const subs = await Subscription.find().populate('storeId');
  return subs.map(s => s.toJSON());
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
    status:  'Activa',
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
  sub.status  = 'Activa';

  return await sub.save();
};

const cancelar = async id => {
  const sub = await Subscription.findById(id);
  if (!sub) throw new Error('Suscripción no encontrada');

  sub.status = 'Cancelada';
  return await sub.save();
};

export const eliminar = async id => {
  const sub = await Subscription.findByIdAndDelete(id);
  if (!sub) throw new Error('Suscripción no encontrada');
  return { message: 'Suscripción eliminada' };
};

const hasActiveSubscriptionForCommerce = async commerceId => {
  if (!commerceId) return false;
  const stores = await Store.find({ commerceId }).select('_id');
  if (!stores.length) return false;
  const storeIds = stores.map(s => s._id);
  const sub = await Subscription.findOne({ storeId: { $in: storeIds }, status: 'Activa' });
  return !!sub;
};

export default { getAll, crear, renovar, cancelar, eliminar, hasActiveSubscriptionForCommerce };
