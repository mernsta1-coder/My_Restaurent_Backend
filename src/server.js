import express from 'express';
import cors from 'cors';
import mongoose  from 'mongoose';
import dotenv from 'dotenv';
import router from './routes/user.js';
import cart from './routes/cart.js';
import mail from './routes/subscribe.js';
import bookingTable from './routes/bookTable.js'
import contactRoutes from "./routes/contact.js"
import orderRoute from '../src/routes/order.js'
import bodyParser from 'body-parser';


dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({   origin: [
    "https://my-restaurent-frontend.vercel.app",
    "http://localhost:5173"  // local dev
  ],
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  credentials: true
}));

app.use('/api/users',router);
app.use('/api/users/api/cart', cart);
app.use('/api/users/api',mail);
app.use('/api/users/api/booking', bookingTable);
app.use("/api/users/api/contact", contactRoutes);
app.use(`/api/users/api/order`, orderRoute);




mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("connected to database")})
    .catch((err)=>{
        console.log("err connecting to db is ",err);
    });

    const port= process.env.PORT ;
    app.listen(port,()=>{
        console.log(`server is running on the port is http://localhost:${port}`);
    });



