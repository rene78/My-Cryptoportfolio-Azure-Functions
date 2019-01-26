/**
 * Model: Portfolio
 */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Portfolio Schema.
var Schema = mongoose.Schema;

var PortfolioSchema = new Schema({
  fiat: {type: String, required: true},
  token: [{
    cryptoTicker: {type: String, required: true},
    cryptoName: {type: String, required: true},
    cryptoQty: {type: Number, min: 0, required: false},
    cryptoInvestedSum: {type: Number, min: 0, required: false}
  }]},
  {
    timestamps: true //add createdAt and updatedAt fields to the schema
  }
);

// Export the model.
module.exports = mongoose.model('Portfolio', PortfolioSchema);