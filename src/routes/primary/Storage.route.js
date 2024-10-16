import Primary from './Primary.js';
import StorageController from '../../controllers/primary/Storage.controller.js';

class StorageRoute extends Primary {
  constructor(server) {
    super(server);

    this.API = this.server.API;
    this.endpointPrefix = this.endpointPrefix + '/storage';
    this.StorageController = new StorageController(this.server);

    this.routes();
  }

  routes() {
    // --- --- --- --- --- --- --- //

    this.API.post(this.endpointPrefix + '/store', (req, res) => {
      this.StorageController.store(req, res);
    });

    this.API.get(this.endpointPrefix + '/get', (req, res) => {
      this.StorageController.getFile(req, res);
    });

    

    // --- --- --- --- --- --- --- //
  }
}

export default StorageRoute;