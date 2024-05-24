const { Schema, model } = require("mongoose");

const Pizza = new Schema(
  {
    PizzaName: String,
    quantity: Number,
    price: Number,
    identify: String,
  },
  {
    timestamps: true,
  },
  {
    versionKey: false,
  }
);

const PizzaModel = model("pizza", Pizza);
module.exports = PizzaModel;
