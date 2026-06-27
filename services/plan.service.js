import Plan from '../models/plan.model.js';
import { toD128 } from '../utils/decimal.helper.js';

export const getplans = async () => {
  const plans = await Plan.find({ status: 'active' });
  return plans.map(p => p.toJSON());
};

export const getPlanById = async id => {
  const plan = await Plan.findById(id);
  return plan ? plan.toJSON() : null;
};

export const createPlan = async data => {
  const plan = new Plan({
    name:       data.name,
    price:      toD128(data.price),
    minimum:    data.minimum,
    commission: data.commission ? toD128(data.commission) : toD128('2'),
    status:     'active',
    createdAt:  new Date().toISOString().split('T')[0],
  });
  return await plan.save();
};

export const updatePlan = async (id, data) => {
  const update = {
    name:    data.name,
    price:   toD128(data.price),
    minimum: data.minimum,
  };
  if (data.commission) update.commission = toD128(data.commission);
  return await Plan.findByIdAndUpdate(id, update, { new: true });
};

export const deletePlan = async id => {
  const plan = await Plan.findByIdAndDelete(id);
  if (!plan) throw new Error('Plan no encontrado');
  return { message: 'Plan eliminado' };
};
