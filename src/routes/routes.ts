// require the express module
import express from "express";
import { Cart } from "../models/cart";

// create a new Router object
//Require the module that will contain the routes you have created.
const routes = express.Router();

//Start your server out with a hard-coded array of cart items, each including id, product, price, and quantity.
const items: Cart[] = [
  { product: "avocado", price: 2, quantity: 2, id: 1 },
  { product: "lettuce", price: 4, quantity: 1, id: 2 },
  { product: "cucumber", price: 1, quantity: 3, id: 3 },
];

//1.GET /cart-items
let nextId = items.length + 1;
routes.get("/cart-items", (req, res) => {
  let maxPrice = req.query.maxPrice;
  let prefix = req.query.prefix;
  let pageSize = req.query.pageSize;

  let filteredItems: Cart[] = items;

  if (maxPrice) {
    filteredItems = filteredItems.filter(
      (cart) => cart.price <= Number(maxPrice)
    );
  }
  if (prefix) {
    filteredItems = filteredItems.filter((cart) =>
      cart.product.startsWith(prefix!.toString())
    );
  }
  if (pageSize) {
    filteredItems = filteredItems.slice(0, Number(pageSize));
  }
  res.status(200);
  res.json(filteredItems);
});
//2.GET /cart-items/:id
routes.get("/cart-items/:id", (req, res) => {
  let { id } = req.params;

  let foundItem = items.find((item) => item.id === Number(id));

  if (foundItem) {
    res.status(200);
    res.json(foundItem);
  } else {
    res.status(404);
    res.json("ID Not Found");
  }
});
//3.POST /cart-items
routes.post("/cart-items", (req, res) => {
  let item = req.body;
  item.id = nextId;
  nextId++;
  items.push(item);
  res.status(201);
  res.json(req.body);
});
//4/PUT /cart-items/:id
routes.put("/cart-items/:id ", (req, res) => {
  let id = req.params;
  let updatedItem = req.body;

  let index: number = items.findIndex((item) => item.id === Number(id));

  if (index != -1) {
    items[index] = updatedItem;
    res.status(200);
    res.json(updatedItem);
  } else {
    res.status(404);
    res.json("not found");
  }
});
//5.DELETE /cart-items/:id
routes.delete("/cart-items/:id ", (req, res) => {
  let id = req.params;
  let updateCart = req.body;
  let index: number = items.findIndex((item) => item.id === Number(id));

  if (index > -1) {
    items.splice(index, 1);
    res.status(204);
    res.json();
  }
});

export default routes;
