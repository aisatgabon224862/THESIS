const orders = [
  {
    id: 1,
    customer: "Kurt",
    products: [
      { name: "Laptop", price: 35000, quantity: 1 },
      { name: "Mouse", price: 500, quantity: 2 },
    ],
  },
  {
    id: 2,
    customer: "John",
    products: [
      { name: "Keyboard", price: 1200, quantity: 3 },
      { name: "Monitor", price: 8000, quantity: 1 },
    ],
  },
  {
    id: 3,
    customer: "Jane",
    products: [
      { name: "Mouse", price: 500, quantity: 1 },
      { name: "Laptop", price: 35000, quantity: 1 },
    ],
  },
];

const TotalSales = orders.reduce((total, sales) => {
  const orderTotal = sales.products.reduce((p, price) => {
    return p + price.price * price.quantity;
  }, 0);
  return total + orderTotal;
}, 0);
console.log(TotalSales);
