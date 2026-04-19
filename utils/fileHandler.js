const fs = require('fs');
const path = require('path');

module.exports = {
  readFile: file => {
    try {
      const data = fs.readFileSync(path.join(__dirname, '..', 'data', file), 'utf-8');
      return JSON.parse(data || '[]');
    } catch (error) {
      console.error(`Error leyendo el archivo ${file}:`, error);
      return [];
    }
  },
  // writeFile: (file, data) => {
  //   await fs.writeFile(path, JSON.stringify(data, null, 2));
  // },
};
