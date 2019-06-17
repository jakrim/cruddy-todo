const fs = require("fs");
const path = require("path");
const _ = require("underscore");
const counter = require("./counter");

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((error, counterString) => {
    if (error) {
      throw error;
    } else {
      let id = counterString;
      fs.writeFile(exports.dataDir + "/" + id + ".txt", text, error => {
        if (error) {
          throw error;
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = callback => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
  fs.readdir(exports.dataDir, (error, files) => {
    if (error) {
      throw error;
    } else {
      let array = [];
      _.map(files, file => {
        var filename = file.slice(0, -4);
        array.push({ id: filename, text: filename });
      });
      callback(null, array);
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + "/" + id + ".txt", "utf8", (error, data) => {
    if (error) {
      callback(error);
    } else {
      callback(null, { id: id, text: data });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.writeFile(exports.dataDir + "/" + id + ".txt", text, (error, data) => {
    if (error) {
      callback(error);
    } else {
      callback(null, { id: id, text: data });
    }
  });
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, "data");

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
