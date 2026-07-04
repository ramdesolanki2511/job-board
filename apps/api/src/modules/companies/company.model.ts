import mongoose, { InferSchemaType, Schema } from "mongoose";

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    website: {
      type: String,
      default: "",
    },

    careersUrl: {
      type: String,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    industry: {
      type: String,
      default: "",
    },

    size: {
      type: String,
      default: "",
    },

    headquarters: {
      type: String,
      default: "",
    },

    foundedYear: {
      type: Number,
      default: null,
    },

    linkedinUrl: {
      type: String,
      default: "",
    },

    twitterUrl: {
      type: String,
      default: "",
    },

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
  }
);

CompanySchema.index({
  name: 1,
});

CompanySchema.index({
  slug: 1,
});

export type Company = InferSchemaType<typeof CompanySchema>;

export default mongoose.model("Company", CompanySchema);