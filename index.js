const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
require("dotenv").config();

app.use(bodyParser.json());

app.use(express.static());
const unprotectedData = [
  { id: 1, name: "josh", age: 31 },
  { id: 2, name: "Sean", age: 26 },
  { id: 3, name: "Michael", age: 23 },
  { id: 4, name: "Travis", age: 28 },
  { id: 5, name: "Hunter", age: 19 }
];

// protected data
const protectedData = [
  { customerId: 1, ccNumber: "4242-4242-4242-4242" },
  { customerId: 2, ccNumber: "4242-4242-4242-4242" },
  { customerId: 3, ccNumber: "4242-4242-4242-4242" },
  { customerId: 4, ccNumber: "4242-4242-4242-4242" },
  { customerId: 5, ccNumber: "4242-4242-4242-4242" }
];

function checkForAuthorization(req, res, next) {
  if (req.headers.key === "test") {
    next();
  } else {
    res.status(401).json("You didnt send the correct Api key");
  }
}

function middleware1(req, res, next) {
  req.query.name = req.query.name + req.query.name;
  next();
}
function middleware2(req, res, next) {
  req.query.name = req.query.name + req.query.name;
  next();
}
function middleware3(req, res, next) {
  req.query.name = req.query.name + " this is midddleware 3 " + req.query.name;
  next();
}

function middleware4(req, res, next) {
  req.query.name = req.query.name + req.query.name;
  next();
}
function middleware5(req, res, next) {
  console.log(req.query.name);
  next();
}

app.get(
  "/api/unsecure/data",
  middleware1,
  middleware2,
  middleware3,
  middleware4,
  middleware5,
  (req, res, next) => {
    res.status(200).json(unprotectedData);
  }
);

// COUNTER

// let counter = 0;

// function increaseCounter(req, res, next) {
//   counter++;
//   next();
// }
// console.log(process.env.SESSION_SECRET);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000 * 24 * 14
    }
  })
);

function counterWithSession(req, res, next) {
  console.log(req.session);
  if (!req.session.counter) {
    req.session.counter = 1;
  } else {
    ++req.session.counter;
  }
  next();
}

app.get("/api/counter", counterWithSession, (req, res, next) => {
  res.status(200).json(req.session.counter);
});

app.get("/api/reset_session", (req, res, next) => {
  req.session.destroy();
  res.status(200).json("your session has been destroyed!");
});

// AUTHORIZED ENDPOINTS

app.use(checkForAuthorization);

app.get("/api/secure/data", (req, res, next) => {
  res.status(200).json(protectedData);
});

const PORT = 4000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
