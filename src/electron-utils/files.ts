const fs = require("fs");
const path = require("path");

const filePath = path.join(require("os").homedir() + "/Documents/neo-blogger/");

function checkForFolder() {
  return new Promise((resolve) => {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
      resolve(true);
    } else {
      resolve(true);
    }
  });
}

function write(data: string, filename: string) {
  return new Promise((resolve) => {
    fs.writeFile(filePath + filename, data, (err: Error) => {
      if (err) {
        console.error(err);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

const readFiles = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(filePath, (err: Error, files: string[]) => {
      if (err) return reject(err);
      return resolve(files);
    });
  });
};

function read(filename: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath + filename, "utf-8", (err: Error, data: string) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = {
  read,
  write,
  checkForFolder,
  readFiles,
};

export { read, write, checkForFolder, readFiles };
