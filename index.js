const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
const Products = require('../my-app/products')
require("dotenv").config()
const Register = require('../my-app/register')
const productRoutes = require('../my-app/Routes/product/product')
const authRoutes = require('../my-app/Routes/auth/auth')
const cartRoutes = require('../my-app/Routes/cart/cart')
const checkoutRoutes = require('../my-app/Routes/checkout/checout')
const cors = require('cors')
const WebSocket = require("ws");
const http = require("http");
app.use(express.json())
const corsOptions = {
  origin: ['http://localhost:4000', 'https://burger-website-psi.vercel.app'], // No trailing slash
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ["Content-Type", "Authorization"], // Use 'allowedHeaders' instead of 'Headers'
  credentials: true,
};

// Use the CORS options for all routes
app.use(cors(corsOptions));

// Enable pre-flight request handling for all routes
app.options('*', cors(corsOptions));

app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
      if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ message: "Bad Request: Body cannot be empty" });
      }
  }
  next();
});


app.get("/", (req, res) => {
    res.send("Hello World");
  });


app.use('/product', productRoutes)
app.use('/auth' , authRoutes)
app.use('/cart' , cartRoutes)
app.use('/checkout', checkoutRoutes)


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    console.log("Received:", message);
    ws.send("Hello, you sent -> " + message);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    ws.send(JSON.stringify({ error: "Internal server error" }));
  });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket server is running on ws://localhost:${PORT}/`);
    
})
 
const getUsersSortedByFirstnameAsc = async () => {
    try {
      const admin = await Register.find().sort({ firstname: 1 });
      console.log(admin);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
 


  mongoose.connect(process.env.DB_CONNECTI)
  .then(() => {
      console.log('Database connected successfully');
      getUsersSortedByFirstnameAsc();  // Call your function here
  })
  .catch((err) => {
      console.error('Database connection error:', err);
  });