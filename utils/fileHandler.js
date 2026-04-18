const fs = require('fs/promises');

module.exports = {
  readFile: async path => {
    try {
      const data = await fs.readFile(path, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (error) {
      return [];
    }
  },
  writeFile: async (path, data) => {
    await fs.writeFile(path, JSON.stringify(data, null, 2));
  },
};
