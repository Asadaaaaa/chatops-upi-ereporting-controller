import axios from 'axios';
import Sha256Helper from '../../helpers/SHA256.helper.js'
import FileSystemHelper from '../../helpers/FileSystem.helper.js';

class StorageService {
  constructor(server) {
    this.server = server;

    this.FileSystemHelper = new FileSystemHelper(this.server);
  }

  async getFile(fileName) {
    const path = '/server_data/iku_files/' + fileName;
    
    // check if file exists in path
    if(!this.server.FS.existsSync(process.cwd() + path)) {
      return -1;
    }

    const getFile = await this.FileSystemHelper.readFile(path);

    return {
      ...getFile
    }
  }

  async store(data) {
    const timeStamp = Date.now();
    const getTimeHash = new Sha256Helper().getHash(timeStamp, null);
    
    this.storeTeleFile(data, getTimeHash);
    
    return {
      filePath: this.server.env.SERVER_HOST + (
        this.server.env.SERVER_HOST.startsWith('https') ? '' : ':' + this.server.env.PORT
      ) + '/' + this.server.env.API_VERSION + '/primary/storage/get?file=' + getTimeHash + '.' + data.mime_type.split('/')[1],
    }
  }

  async storeTeleFile(data, timeHash) {
    try {
      // Step 1: Get the file path from Telegram
      const fileResponse = await axios.get(`https://api.telegram.org/bot${data.bot_token}/getFile?file_id=${data.file_id}`);
      const filePath = fileResponse.data.result.file_path;

      // Step 2: Download the file using the file path
      const fileUrl = `https://api.telegram.org/file/bot${data.bot_token}/${filePath}`;
      const response = await axios.get(fileUrl, { responseType: 'stream' });

      const getFileType = data.mime_type.split('/')[1];

      const saveFilePath = process.cwd() + '/server_data/iku_files/' + timeHash + '.' + getFileType;
      
      const writer = this.server.FS.createWriteStream(saveFilePath);

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          this.server.sendLogs('Download Success')
          resolve(saveFilePath)
        });
        writer.on('error', reject);
      });

    } catch (error) {
      this.server.sendLogs('Error downloading file:');
      console.log(error);
      return false;
    }
  }
}

export default StorageService;
