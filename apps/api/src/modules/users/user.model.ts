import mongoose, { Schema, InferSchemaType } from "mongoose";
import {
  UserRole,
  AuthProvider,
  SubscriptionStatus,
} from "../../shared/constants/user.constants";

const UserSchema = new Schema(
  {
    // Basic
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    // Authentication
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },

    provider: {
      type: String,
      enum: Object.values(AuthProvider),
      default: AuthProvider.LOCAL,
    },

    providerId: {
      type: String,
      default: null,
    },

    // Account Status
    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    // Subscription
    subscriptionStatus: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.NONE,
    },

    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },

    // Verification
    emailVerificationToken: {
      type: String,
      default: null,
    },

    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },

    // Activity
    lastLoginAt: Date,

    lastActiveAt: Date,
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 });

UserSchema.index({ role: 1 });

UserSchema.index({ subscriptionStatus: 1 });

UserSchema.set("toJSON", {
  transform(_, ret: Record<string, unknown>) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export type User = InferSchemaType<typeof UserSchema>;

export default mongoose.model("User", UserSchema);