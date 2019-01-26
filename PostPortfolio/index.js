module.exports = async function (context, req) {
  // Let's call it log.
  //const log = context.log;
  context.log("Function started! The following ID was passed: " + req.query.id);

  /**
   * Azure function Response.
   *
   * Processes the `req` request from Paddle.com
   * and saves the data to MongoDB Atlas while
   * responding the `res` response.
   */

  // Database interaction.
  const mongoose = require('mongoose');
  const DATABASE = process.env.MongodbAtlas;

  // Connect to our Database and handle any bad connections
  mongoose.connect(DATABASE);
  mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
  mongoose.connection.on('error', (err) => {
    context.log(`ERROR→ ${err.message}`);
  });

  // Portfolio Schema.
  require('../portfolioModel');
  const Portfolio = mongoose.model('Portfolio');

  //Create a Portfolio object.
  //console.log("Content of request body: ",req.body);
  const portfolio = new Portfolio(req.body);
  //console.log("New id is already created with the creation of the new object! " +portfolio._id);

  //Local demo portfolio
  //portfolio.fiat = "EUR";
  //portfolio.token[0] = { crypto_ticker: "BTC", crypto_name: "Bitcoin", crypto_qty: 50, crypto_invested_sum: 9000 };

  // Save to db.
  //Create new entry in database, if no id has been forwarded (i.e. coming from start page)
  if (req.query.id == undefined) {
    try {
      var pf = await portfolio.save();
      context.log("[OUTPUT]—— PORTFOLIO SAVED: ", pf);
      //context.log("output id: ", pf._id);
      //Respond with 200
      context.res = {
        headers: { 'Content-Type': 'application/json' },
        body: pf, //Return the portfolio, which has just been saved in the database, in order to display it.
        status: 200
      };
    } catch (err) {
      context.log(err);
      context.res = {
        headers: { 'Content-Type': 'application/json' },
        body: err, //Return the portfolio, which has just been saved in the database, in order to display it.
        status: 422 //Validation error
      }
    }

  } else {
    //Overwrite entry in database, if id has been forwarded (i.e. coming from personal portfolio)
    try {
      portfolio._id = req.query.id;
      var pf = await Portfolio.findByIdAndUpdate(req.query.id, portfolio, { new: true }).exec();
      context.log("[OUTPUT]—— PORTFOLIO OVERWRITTEN: ", pf);
      context.res = {
        headers: { 'Content-Type': 'application/json' },
        body: pf, //Return the portfolio, which has just been saved in the database, in order to display it.
        status: 200
      }
    } catch (err) {
      context.log(err);
    }
  };
  /*
  //The code below works
  portfolio._id = req.query.id;
  Portfolio.findByIdAndUpdate(req.query.id, portfolio, {new: true}, function (err, theportfolio) {
    if (err) { context.log(err); }
    context.log("[OUTPUT]—— PORTFOLIO OVERWRITTEN: ", theportfolio);
  });
  context.res = {
    headers: { 'Content-Type': 'application/json' },
    body: portfolio, //Return the portfolio, which has just been saved in the database, in order to display it.
    status: 200
  }
};
*/
};

/*
  // With Promise
  let saveToDb = new Promise(
    (resolve, reject) => {
      resolve(portfolio.save());
      context.res = {
        status: 200,
        body: "This is the id of the newly created portfolio: " + portfolio.url
      };
      console.log("Work in promise");
    }
  );

  saveToDb.then(function(value) {
    console.log("Work in response");
    //Respond with 200
    console.log(value);

    //context.done();
  }).catch(err => context.log.error(err));

};
*/

  /*
  portfolio.save(function (err) {
    if (err) { context.log("Error: " + err) }; //find a better way to handle errors
    //If the save operation worked:
    context.log("This is the id of the newly created portfolio: " + portfolio.url);
    context.res = {
      headers: {
        "Content-Type": "text/plain",
        "User-agent": "request"
      },
      status: 200,
      body: "This text should appear in the body!"
    };

  });
*/

  //const test = await (new Portfolio(testPortf)).save();

  // Informs the runtime that your code has finished. You must call context.done, or else the runtime never knows that your function is complete, and the execution will time out.
  // @link: https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node#contextdone-method




/*
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.name || (req.body && req.body.name)) {
        context.res = {
            // status: 200, /* Defaults to 200
            body: "Hello " + (req.query.name || req.body.name)
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
    context.done();
};
*/