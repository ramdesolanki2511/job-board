import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAuditLog extends Document {
  action: string;
  userId?: string;
  targetId?: string;
  details?: string;
  ipAddress?: string;
  meta?: Record<string, any>;
  createdAt: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    action: { type: String, required: true, index: true },
    userId: { type: String, index: true },
    targetId: { type: String, index: true },
    details: { type: String },
    ipAddress: { type: String },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AuditLogSchema.index({ action: 1, createdAt: -1 });

const AuditLogModel: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

export default AuditLogModel;
