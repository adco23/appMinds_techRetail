function validate(validations, res) {
  for (let v of validations) {
    if (v.condition) {
      res.status(400).json({ error: v.message });
      return false;
    }
  }
  return true;
}

module.exports = { validate };
