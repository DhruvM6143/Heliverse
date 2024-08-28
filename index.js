import dotenv from 'dotenv'

import { app } from './app.js'
import connectDB from './config/db.config.js'

dotenv.config()
const PORT = process.env.PORT || 8000;
connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.log("MongoDB Connection Error!! ", err);
    })