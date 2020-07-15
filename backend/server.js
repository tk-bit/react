import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from './config';
import userRoute from './routes/userRoute';
import productRoute from './routes/productRoute';
import orderRoute from './routes/orderRoute';
import uploadRoute from './routes/uploadRoute';

const cors = require('cors')
const shortid = require('shortid')
const Razorpay = require('razorpay')

const mongodbUrl = config.MONGODB_URL;
mongoose
  .connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((error) => console.log(error.reason));

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/uploads', uploadRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.get('/api/config/paypal', (req, res) => {
  res.send(config.PAYPAL_CLIENT_ID);
});
app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));
app.use(express.static(path.join(__dirname, '..','frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,'..', 'build', 'index.html'))
});


const razorpay = new Razorpay({
  key_id: 'rzp_test_LyQUQA2sH58KIZ',
  key_secret: 'dygV0PzE4vQX09g6xRMxvwi1'
})

app.post('/razorpay', async (req, res) => {
  const payment_capture = 1
  const amount = 5
  const currency = 'INR'

  const options = {
    amount: amount*100,
    currency,
    receipt: shortid.generate(),
    payment_capture
  }
try{
  const response = await razorpay.orders.create(options)
  console.log(response)
  res.json({
    id: response.id,
    amount: response.amount,
    currency: response.currency
  })
}catch(error){
  console.log(error)
}

})

app.listen(config.PORT, () => {
  console.log('Server started at http://localhost:5000');
});