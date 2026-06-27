import Subscription from "../models/subscription.model.js";

export const getAll = async () => {
  return await Subscription.find().populate('storeId');
};

const crear = async data => {
  const hoy = new Date();
  const opciones = { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit' };

  const [diaS, mesS, anioS] = hoy.toLocaleDateString('es-AR', opciones).split('/');
  const startDate = `${anioS}-${mesS}-${diaS}`;

  const vencimiento = new Date();
  vencimiento.setDate(hoy.getDate() + 30);
  const [diaE, mesE, anioE] = vencimiento.toLocaleDateString('es-AR', opciones).split('/');
  const expDate = `${anioE}-${mesE}-${diaE}`;

  const parsedAmount = Number(data.amount);

  if (isNaN(parsedAmount)) {
    throw new Error('El monto (amount) enviado no es un número válido o no fue proporcionado.');
  }

  if (data.storeId) {
    await Subscription.updateMany(
      { storeId: data.storeId, status: 'Activa' },
      { $set: { status: 'Inactiva' } }
    );
  }

  const nuevaSub = new Subscription({
    detail:  data.detail,
    amount:  parsedAmount,
    startDate,
    expDate,
    status:  'Activa',
    storeId: data.storeId,
    planId:  data.planId
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

export default { getAll, crear, renovar, cancelar, eliminar };
