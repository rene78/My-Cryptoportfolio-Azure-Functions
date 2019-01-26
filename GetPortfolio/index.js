module.exports = function (context, req) {

  context.log("Function started! The following ID was passed: " +req.query.id);

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

  Portfolio.findById(req.query.id)
    .exec(function (err, list_portfolio) {
      if (err) {
        context.log('Error running query');
        context.log(err);
        context.res = {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
          body: err
        };
        return context.done();
      }

      //If invalid _id has been entered a list_portfolio is empty
      if (!list_portfolio) {
        context.log('Portfolio could not be found!');
        context.log(err);
        context.res = {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
          body: err
        };
        return context.done();
      }

      context.log('Success!');
      context.log(list_portfolio);
      context.res = {
        headers: { 'Content-Type': 'application/json' },
        body: list_portfolio
        //body: JSON.stringify({ res: list_portfolio })
      };
      context.done();

      /*
        //If invalid _id has been entered a list_portfolio is empty
        if (!list_portfolio) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        }
        //If everything is fine:
        context.res=list_portfolio;
        context.done();
      */
    });

};