import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        company: { type: String, required: true },
        location: String,
        description: String,
        applied: { type: Boolean, default: false },
    },
    { timestamp: true }
)

const Job = mongoose.model("Job", jobSchema)

export default Job;