import mongoose from 'mongoose';
import Decimal from 'decimal.js';

Decimal.set({
  precision: 20,
  rounding: Decimal.ROUND_HALF_EVEN,
  toExpNeg: -9,
  toExpPos: 20,
});

export const toD128 = value =>
  mongoose.Types.Decimal128.fromString(
    new Decimal(value.toString()).toFixed(4)
  );

export const fromD128 = d128 => new Decimal(d128.toString());

export const decimal128ToJSON = {
  toJSON: {
    transform(doc, ret) {
      for (const key of Object.keys(ret)) {
        if (ret[key] instanceof mongoose.Types.Decimal128) {
          ret[key] = ret[key].toString();
        }
      }
      return ret;
    },
  },
};
