abstract class BaseCtrl {

  abstract model: any;

  validationError = (res: any, statusCode?:number) => {
    statusCode = statusCode || 422;
    return function(err) { console.log(err);
      return res.status(statusCode).json(err);
    };  
  }

  handleError = (res: any, statusCode?:number) => {
    statusCode = statusCode || 500;
    return function(err) {
      return res.status(statusCode).send(err);
    };  
  }

  respondWithResult = (res: any, statusCode?:number) => {
    statusCode = statusCode || 200;
    return function(entity) { 
      if(entity) {
        return res.status(statusCode).json(entity);
      }
      return null;
    };
  }

  // Get all
  getAll = (req, res) => {
    this.model.find({}, (err, docs) => {
      if (err) { return console.error(err); }
      res.json(docs);
    });
  }

  // Count all
  count = (req, res) => {
    this.model.count((err, count) => {
      if (err) { return console.error(err); }
      res.json(count);
    });
  }

  // Insert
  insert = (req, res) => {
    const obj = new this.model(req.body);
    obj.save()
      .then(this.respondWithResult(res))
      .catch(this.validationError(res));
  }

  // Get by id
  get = (req, res) => {
    this.model.findOne({ _id: req.params.id }, (err, obj) => {
      if (err) { return console.error(err); }
      res.json(obj);
    });
  }

  // Update by id
  update = (req, res) => {
    this.model.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
      if (err) { return console.error(err); }
      res.status(200).json({});
    });
  }

  // Delete by id
  delete = (req, res) => {
    this.model.findOneAndRemove({ _id: req.params.id }, (err) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  }
}

export default BaseCtrl;
