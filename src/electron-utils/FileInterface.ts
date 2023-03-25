const { read, write, checkForFolder, readFiles } = require("./files");

class FileInterface {
  filePaths: string[];
  constructor() {
    this.filePaths = [];
  }
  async checkForFolder() {
    await checkForFolder();
  }
  async indexFiles() {
    try {
      const filenames = (await readFiles()) as string[];
      console.log(filenames);
      this.filePaths = filenames.filter((filename) => /.md$/gi.test(filename));
      console.log(this.filePaths);
    } catch (error) {
      console.error(error);
    }
  }
  async readFile(filename: string) {
    try {
      const data = (await read(filename)) as string;
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  async saveFile(data: string, filename: string) {
    try {
      const success = await write(data, filename);
      return success;
    } catch (error) {
      console.error(error);
    }
  }
  get filenames() {
    return this.filePaths;
  }
}

module.exports = new FileInterface();
