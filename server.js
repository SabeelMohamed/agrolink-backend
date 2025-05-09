const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const buyerRoutes = require('./routes/buyerAuth');
const farmerRoutes = require('./routes/farmerAuth');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const stripeRoutes = require('./routes/stripeRoutes'); // ✅ Added Stripe route

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/buyer', buyerRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', stripeRoutes); // ✅ Mount Stripe route

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(process.env.PORT || 5001, () => {
        console.log(`🚀 Server running on port ${process.env.PORT || 5001}`);
    });
})
.catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
});
