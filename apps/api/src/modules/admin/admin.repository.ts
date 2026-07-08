import AuditLogModel, { IAuditLog } from "./models/audit-log.model";
import SupportTicketModel, { ISupportTicket } from "./models/support-ticket.model";
import SystemSettingsModel, { ISystemSetting } from "./models/system-settings.model";

class AdminRepository {
  // Audit logs
  async createAuditLog(payload: Partial<IAuditLog>) {
    return AuditLogModel.create(payload as any);
  }

  async getAuditLogs(filter: any = {}, options: { skip?: number; limit?: number } = {}) {
    const { skip = 0, limit = 50 } = options;
    const query = AuditLogModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const logs = await query.exec();
    const total = await AuditLogModel.countDocuments(filter);
    return { logs, total };
  }

  // Support tickets
  async createTicket(payload: Partial<ISupportTicket>) {
    return SupportTicketModel.create(payload as any);
  }

  async updateTicket(ticketId: string, update: Partial<ISupportTicket>) {
    return SupportTicketModel.findByIdAndUpdate(ticketId, update, { new: true }).exec();
  }

  async getTickets(filter: any = {}, options: { skip?: number; limit?: number } = {}) {
    const { skip = 0, limit = 20 } = options;
    const query = SupportTicketModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const tickets = await query.exec();
    const total = await SupportTicketModel.countDocuments(filter);
    return { tickets, total };
  }

  // System settings
  async getSetting(key: string) {
    return SystemSettingsModel.findOne({ key }).exec();
  }

  async upsertSetting(key: string, value: any, description?: string, type?: string) {
    return SystemSettingsModel.findOneAndUpdate(
      { key },
      { value, description, type },
      { upsert: true, new: true }
    ).exec();
  }

  async listSettings() {
    return SystemSettingsModel.find({}).exec();
  }
}

export default new AdminRepository();
