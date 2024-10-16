import StorageRoute from "./Storage.route.js";

class PrimaryHandler {
  constructor(server) {
    new StorageRoute(server);
  }
}

export default PrimaryHandler;