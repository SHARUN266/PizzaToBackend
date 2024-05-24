const express = require("express");
const app = express();
const mongoose = require("mongoose");

const cors = require("cors");
app.use(cors());
const PizzaModel = require("./Model/pizza.model");
const PORT=8000|| process.env.PORT
app.use(express.json());
// We add our pizza in database
app.post("/postPizza", (req, res) => {
  const data = req.body;

  // Adding createdAt field with current date
  data.createdAt = new Date();

  PizzaModel.create(data)
    .then(function () {
      res.status(200).send("Pizza added successfully!");
    })
    .catch(function (err) {
      res.status(404).send(err);
    });
});
// Get All Pizza of Current Day:-
app.get("/getPizzas", (req, res) => {
  const today = new Date(); // current date
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // set to start of day
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // set to end of day
  
  PizzaModel.find({ createdAt: { $gte: start, $lt: end } })
    .then(function (pizzas) {
      res.json(pizzas);
    })
    .catch(function (err) {
      res.send(err);
    });
});

// Update pizza qty of Current Day:-
app.patch("/updatePizza", (req, res) => {
  const { _id, quantity } = req.body;
  const today = new Date(); 
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // set to start of day
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // set to end of day
  PizzaModel.updateOne(
    { _id, createdAt: { $gte: start, $lt: end } }, // Use destructured _id directly
    { $set: { quantity: quantity } }
  )
    .then(() => {
      res.send("Pizza quantity updated successfully!");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Get Most frequent pizza name of Current Day:-
app.get("/getTrendPizza", (req, res) => {
  const today = new Date(); // current date
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // set to start of day
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // set to end of day

  PizzaModel.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lt: end }
      }
    },
    {
      $group: {
        _id: { name: "$PizzaName", price: "$price" },
        totalQuantity: { $sum: "$quantity" },
      },
    },
    { $sort: { totalQuantity: -1, "_id.price": -1 } },
  ])
    .then(function (result) {
      if (result.length > 0) {
        res.status(200).send(result[0]._id.name);
      } else {
        res.status(404).send("No data found");
      }
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});


// get Pizza by identifier of Current Day:-
app.get("/getPizzaByFilter", (req, res) => {
  const today = new Date(); // current date
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // set to start of day
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // set to end of day

  const filterParams = { ...req.query, createdAt: { $gte: start, $lt: end } };

  // Construct the filter object dynamically based on the provided query parameters
  const filter = {};
  for (const key in filterParams) {
    if (filterParams.hasOwnProperty(key)) {
      filter[key] = filterParams[key];
    }
  }

  PizzaModel.find(filter)
    .then(function (pizza) {
      res.status(200).send(pizza);
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});


//Delete pizza of Current Day:-
app.delete("/removePizza/:_id",(req,res)=>{
    const {_id}=req.params;
    const today = new Date(); // current date
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // set to start of day
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // set to end of day

    PizzaModel.deleteOne({_id, createdAt: { $gte: start, $lt: end } })
      .then(function(){
        res.status(200).send("Pizza remove successfully!")
      }).catch((err)=>{
        res.status(500).send(err)
      })
});

// Get Pizza by date filter:-
app.get("/getPizzaByDate/:date", (req, res) => {
  const {date} = req.params;
  
  
 

  // Parse the date string to create date object
  const filterDate = new Date(date);
  const start = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate()); // set to start of day
  const end = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate() + 1); // set to end of day

  PizzaModel.find({ createdAt: { $gte: start, $lt: end } })
    .then(function (pizza) {
      res.status(200).send(pizza);
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});

mongoose
  .connect(
    "mongodb+srv://sharun:123@atlascluster.qwa1fxi.mongodb.net/AleemBhai?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Your app is running now ${PORT}`);
    });
  });
