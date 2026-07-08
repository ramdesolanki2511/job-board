import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISystemSetting extends Document {
  key: string;
  value: any;
  type?: string;
  description?: string;
  updatedAt: Date;
}

const SystemSettingsSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, required: true },
    type: { type: String },
    description: { type: String },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

const SystemSettingsModel: Model<ISystemSetting> =
  mongoose.models.SystemSetting || mongoose.model<ISystemSetting>("SystemSetting", SystemSettingsSchema);

export default SystemSettingsModel;
