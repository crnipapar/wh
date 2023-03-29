const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const formidable = require("express-formidable");

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(formidable());
let db = new sqlite3.Database("./database/warehouse.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the warehouse database.");
});

db.run(
  "CREATE TABLE IF NOT EXISTS items(id INTEGER PRIMARY KEY, name TEXT, date TEXT, customerInfo TEXT, manufacturer TEXT, type TEXT, model TEXT, downpayment REAL, totalAmount REAL, returnedAt TEXT, note TEXT, customerNotifiedAt TEXT, orderDoneAt TEXT)"
);
db.run(
  "CREATE TABLE IF NOT EXISTS parts(id INTEGER PRIMARY KEY, name TEXT, orderedAt TEXT, description TEXT, sentAt TEXT, arrivedAt TEXT, itemFK INTEGER, FOREIGN KEY (itemFK) REFERENCES items(id) ON DELETE CASCADE ON UPDATE CASCADE)"
);

// Enforce the foreign key constraints
db.run("PRAGMA foreign_keys=ON");

app.get("/", (req, res) => {
  res.status(200);
  res.send("Testing... OK!");
});

// Get all items
// app.get("/items/", (req, res) => {
//   db.all("SELECT * FROM items", [], (err, rows) => {
//     if (err) {
//       throw err;
//     }
//     res.send({ message: "Fetched all items.", data: rows });
//   });
// });

// Get items by month
app.get("/items/month/", (req, res) => {
  const month = req.fields.month;
  const year = req.fields.year;
  const sql = `SELECT * FROM items WHERE date BETWEEN '${year}-${month}-01' AND '${year}-${month}-31';`;
  console.log(sql);
  db.all(
    `SELECT * FROM items WHERE date BETWEEN '${year}-${month}-01' AND '${year}-${month}-31'`,
    [],
    (err, rows) => {
      if (err) {
        throw err;
      }
      res.send({
        message: `Fetched all items for ${month}-${year}`,
        data: rows,
      });
    }
  );
});

// Get all parts for item by item id
app.get("/parts/", (req, res) => {
  const itemID = req.fields.itemID;
  db.all("SELECT * FROM parts WHERE itemFK=" + itemID, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.send({
      message: `Fetched all parts for item ID ${itemID}`,
      data: rows,
    });
  });
});

// Get item by id
app.get("/items/:id", (req, res) => {
  db.get("SELECT * FROM items WHERE id=" + req.params.id, [], (err, row) => {
    if (err) {
      throw err;
    }
    res.send({
      message: `Fetched item with id ${req.params.id}`,
      data: row,
    });
  });
});

// Get part by id
app.get("/parts/:id", (req, res) => {
  db.get("SELECT * FROM parts WHERE id=" + req.params.id, [], (err, row) => {
    if (err) {
      throw err;
    }
    res.send({
      message: `Fetched part with id ${req.params.id}`,
      data: row,
    });
  });
});

// Add new item
app.post("/items/add/", (req, res) => {
  const values = Object.values(req.fields);
  res.status(201);
  const sql =
    "INSERT INTO items(name, customerInfo, date, manufacturer, type, model, downpayment, totalAmount, returnedAt, note, customerNotifiedAt, orderDoneAt) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.run(sql, values, function (err) {
    if (err) {
      res.send({ message: "Item insertion was unsuccessful." });
    }
    res.send({ message: `Item has been inserted with ID ${this.lastID}` });
  });
});

// Add new part
app.post("/parts/add/", (req, res) => {
  const values = Object.values(req.fields);
  res.status(201);
  const sql =
    "INSERT INTO parts(name, orderedAt, description, sentAt, arrivedAt, itemFK) values(?, ?, ?, ?, ?, ?)";

  db.run(sql, values, function (err) {
    if (err) {
      return console.error(err.message);
    }
    res.send({ message: `Part has been inserted with id ${this.lastID}` });
  });
});

// Update item
app.put("/items/edit/", (req, res) => {
  const values = Object.values(req.fields);
  res.status(200);
  const sql =
    "UPDATE items SET name = ?, customerInfo = ?, date = ?, manufacturer = ?, type = ?, model = ?, downpayment = ?, totalAmount = ?, returnedAt = ?, note = ?, customerNotifiedAt = ?, orderDoneAt = ? WHERE id = ?";

  db.run(sql, values, function (err) {
    if (err) {
      return console.error(err.message);
    }
    res.send({ message: `Item with ID ${values.at(-1)} has been updated.` });
  });
});

// Update part
app.put("/parts/edit/", (req, res) => {
  const values = Object.values(req.fields);
  res.status(200);
  const sql =
    "UPDATE parts SET name = ?, orderedAt = ?, description = ?, sentAt = ?, arrivedAt = ? WHERE id = ?";

  db.run(sql, values, function (err) {
    if (err) {
      return console.error(err.message);
    }
    res.send({ message: `Part with ID ${values.at(-1)} has been updated.` });
  });
});

// Delete item
app.delete("/items/delete/", (req, res) => {
  const id = req.fields.id;
  res.status(200);
  const sql = "DELETE FROM items WHERE id = ?";

  db.run(sql, [id], function (err) {
    if (err) {
      return console.error(err.message);
    }
    res.send({ message: `Item with id ${id} has been deleted.` });
  });
});

// Delete part
app.delete("/parts/delete/", (req, res) => {
  const id = req.fields.id;
  res.status(200);
  const sql = "DELETE FROM parts WHERE id = ?";

  db.run(sql, [id], function (err) {
    if (err) {
      return console.error(err.message);
    }
    res.send({ message: `Part with id ${id} has been deleted.` });
  });
});

// Closing DB on exit
process.on("SIGINT", () => {
  db.close();
  console.log("DB closed.");
  app.close();
});

app.listen(3000, () => {
  console.log("Warehouse app listening on port 3000!");
});

// get items only that have populated orderDoneAt

app.get("/items", (req, res) => {
  const orderDone = req.query.orderDone;

  let sql;
  let params;
  if (orderDone === "null") {
    // Fetch items where orderDoneAt is null
    sql = "SELECT * FROM items WHERE orderDoneAt IS NULL";
    params = [];
  } else if (orderDone === "notnull") {
    // Fetch items where orderDoneAt is not null
    console.log("order");
    sql = "SELECT * FROM items WHERE orderDoneAt IS NOT NULL";
    params = [];
  } else {
    // Fetch all items
    sql = "SELECT * FROM items";
    params = [];
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error(err); // log error to console
      return res.status(500).send({ error: "Internal server error" }); // return error response to client
    }

    res.send({ message: "Fetched items.", data: rows });
  });
});
