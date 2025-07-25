import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDB Connected: ", connection)
    } catch (error) {
        console.log('MongoDB connection error:', error)
    }
}