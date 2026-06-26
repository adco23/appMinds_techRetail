import Plan from '../models/plan.model.js';

export const getPlanes = async () => {
  const plans = await Plan.find({ status: 'active' });
  return plans.map(p => p.toJSON());
};

export const getPlanById = async id => {
  const plan = await Plan.findById(id);
  return plan ? plan.toJSON() : null;
};

export const createPlan = async data => {
  const plan = new Plan({
    name:   data.name,
    precio: data.precio,
    minimo: data.minimo,
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0],
  });
  return await plan.save();
};

export const updatePlan = async (id, data) => {
  return await Plan.findByIdAndUpdate(id, {
    name:   data.name,
    precio: data.precio,
    'perído mínimo': data.periodoMinimo,
  }, { new: true });
};

export const deletePlan = async id => {
  const plan = await Plan.findByIdAndDelete(id);
  if (!plan) throw new Error('Plan no encontrado');
  return { message: 'Plan eliminado' };
};
