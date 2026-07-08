import { Request, Response, NextFunction } from "express";
import adminRepository from "../modules/admin/admin.repository";

/**
 * Middleware to check if user is an admin
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  if (user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Forbidden - Admin access required",
    });
  }

  next();
};

/**
 * Middleware to check if user is an admin or moderator
 */
export const requireAdminOrModerator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  if (user.role !== "admin" && user.role !== "moderator") {
    return res.status(403).json({
      success: false,
      error: "Forbidden - Admin or Moderator access required",
    });
  }

  next();
};

/**
 * Middleware to check if user is a super admin
 */
export const requireSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  if (user.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      error: "Forbidden - Super Admin access required",
    });
  }

  next();
};

/**
 * Middleware to log admin actions for audit trail
 */
export const logAdminAction = (action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const details = {
      action,
      userId: user?.id,
      method: req.method,
      path: req.path,
      params: req.params,
      timestamp: new Date(),
      ipAddress: req.ip,
    };

    // Persist audit log asynchronously (fire-and-forget)
    try {
      adminRepository.createAuditLog(details as any).catch((err) => {
        console.error("Failed to persist admin audit log:", err);
      });
    } catch (err) {
      console.error("Failed to queue audit log:", err);
    }

    // Also emit to console for local visibility
    console.log("Admin Action:", details);

    next();
  };
};
