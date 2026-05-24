import fs from "fs";
import path from "path";

const dataPath = path.join(__dirname, '..', 'data');

const readFile = fileName => {
  try {
    const filePath = path.join(dataPath, fileName);

    if (!fs.existsSync(filePath)) {
      return [];
    }

    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error(`Error reading file ${fileName}:`, error);
    return [];
  }
};

const writeFile = (fileName, data) => {
  try {
    const filePath = path.join(dataPath, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing file ${fileName}:`, error);
    throw error;
  }
};

export default {
  readFile,
  writeFile,
};
