import mongoose, { Schema, InferSchemaType } from "mongoose";

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    website: String,

    careersUrl: String,

    logo: String,

    description: String,

    industry: String,

    size: String,

    headquarters: String,

    foundedYear: Number,

    linkedinUrl: String,

    twitterUrl: String,

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

CompanySchema.index({
  slug: 1,
});

CompanySchema.index({
  name: 1,
});

export type Company = InferSchemaType<typeof CompanySchema>;

export default mongoose.model("Company", CompanySchema);
