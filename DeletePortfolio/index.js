module.exports = function (context, req) {

  context.log("Function started! The following ID was passed: " + req.query.id);

  // Database interaction.
  const mongoose = require('mongoose');
  const Portfolio = require('../portfolioModel');
  const DATABASE = process.env.MongodbAtlas;

  // Connect to our Database and handle any bad connections
  mongoose.connect(DATABASE);
  mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
  mongoose.connection.on('error', (err) => {
    context.log(`ERROR→ ${err.message}`);
  });

  Portfolio.findByIdAndRemove(req.query.id, function deletePortfolio(err, doc) {
    if (err) {
      context.res = {
        status: 500,
        body: "Malformed id!" //Bug: This only works for random strings as request parameter.
        //If id has the right format but is not in the DB the function returns 200. Rewrite as async func similar to "postPortfolio"
      };
      return context.done();
    }
    //Else success!
    //console.log("Deleted portfolio: " +doc);
    context.res = {
      status: 200,
      body: "Portfolio " + req.query.id + " has been successfully deleted!"
    };
    //console.log("Portfolio " + req.query.id + " has been successfully deleted!");
    // Success - go to demo portfolio. Send message: "Portfolio deleted"
    //res.redirect('/');
    context.done();
  });

};