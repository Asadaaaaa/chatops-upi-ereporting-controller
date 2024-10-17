import ResponsePreset from "../../helpers/ResponsePreset.helper.js";

import StorageValidator from "../../validators/primary/Storage.validator.js";
import StorageService from "../../services/primary/Storage.service.js";

// Library
import Ajv from "ajv";

class StorageController {
  constructor(server) {
    this.server = server;
    
    this.ResponsePreset = new ResponsePreset();
    this.Ajv = new Ajv();
    this.StorageValidator = new StorageValidator();
    this.StorageService = new StorageService(this.server);
  }

  async store(req, res) {
    const schemeValidate = this.Ajv.compile(this.StorageValidator.store);

    if(!schemeValidate(req.body)) return res.status(400).json(this.ResponsePreset.resErr(
      400,
      schemeValidate.errors[0].message,
      "validator",
      schemeValidate.errors[0]
    ));

    const storeSrv = await this.StorageService.store(req.body);

    return res.status(200).json(this.ResponsePreset.resOK('OK', storeSrv));
  }

  async getFile(req, res) {
    const getFileSrv = await this.StorageService.getFile(req.query.file);

    if(getFileSrv === -1) return res.status(404).json(this.ResponsePreset.resErr(404, 'File Not Found', 'service', {
      code: -1
    }))

    res.setHeader("Content-Type", getFileSrv.mime);
    res.setHeader(
      "Content-Disposition",
      "inline; filename=" + req.query.file + '; title=' + new Date() + ';'
    );

    return res.status(200).send(getFileSrv.file)
  }
}

export default StorageController;
