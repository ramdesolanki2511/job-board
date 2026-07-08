import mongoose, { Document, Model, Schema } from "mongoose";

export type TicketStatus = "open" | "pending" | "assigned" | "resolved" | "closed";

export interface IMessage {
  authorId?: string;
  message: string;
  createdAt: Date;
}

export interface ISupportTicket extends Document {
  userId?: string;
  companyId?: string;
  subject: string;
  message: string;
  status: TicketStatus;
  priority?: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  tags?: string[];
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    authorId: { type: String },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const SupportTicketSchema: Schema = new Schema(
  {
    userId: { type: String, index: true },
    companyId: { type: String, index: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["open", "pending", "assigned", "resolved", "closed"], default: "open" },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    assignedTo: { type: String },
    tags: { type: [String], default: [] },
    messages: { type: [MessageSchema], default: [] },
  },
  { timestamps: true }
);

SupportTicketSchema.index({ status: 1, priority: -1, createdAt: -1 });

const SupportTicketModel: Model<ISupportTicket> =
  mongoose.models.SupportTicket || mongoose.model<ISupportTicket>("SupportTicket", SupportTicketSchema);

export default SupportTicketModel;
