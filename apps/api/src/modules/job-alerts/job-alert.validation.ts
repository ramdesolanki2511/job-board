import Joi from "joi";
import { AlertFrequency } from "../../shared/constants/job-alert.constants";

export const createJobAlertSchema = Joi.object({
  name: Joi.string().required().trim().min(3).max(100).messages({
    "string.empty": "Alert name is required",
    "string.min": "Alert name must be at least 3 characters",
    "string.max": "Alert name must not exceed 100 characters",
  }),
  search: Joi.string().optional().trim().max(200),
  skills: Joi.array().items(Joi.string().trim()).optional(),
  remoteType: Joi.array()
    .items(Joi.string().valid("Remote", "Hybrid", "Onsite"))
    .optional(),
  employmentType: Joi.array()
    .items(
      Joi.string().valid(
        "Full Time",
        "Part Time",
        "Contract",
        "Internship",
        "Freelance"
      )
    )
    .optional(),
  experienceLevel: Joi.array()
    .items(
      Joi.string().valid("Fresher", "Junior", "Mid", "Senior", "Lead")
    )
    .optional(),
  salaryMin: Joi.number().optional().min(0),
  salaryMax: Joi.number().optional().min(0),
  salaryCurrency: Joi.string().optional().default("USD"),
  locations: Joi.array().items(Joi.string().trim()).optional(),
  frequency: Joi.string()
    .valid(...Object.values(AlertFrequency))
    .optional()
    .default(AlertFrequency.DAILY),
  emailNotifications: Joi.boolean().optional().default(true),
});

export const updateJobAlertSchema = Joi.object({
  name: Joi.string().optional().trim().min(3).max(100),
  search: Joi.string().optional().trim().max(200),
  skills: Joi.array().items(Joi.string().trim()).optional(),
  remoteType: Joi.array()
    .items(Joi.string().valid("Remote", "Hybrid", "Onsite"))
    .optional(),
  employmentType: Joi.array()
    .items(
      Joi.string().valid(
        "Full Time",
        "Part Time",
        "Contract",
        "Internship",
        "Freelance"
      )
    )
    .optional(),
  experienceLevel: Joi.array()
    .items(
      Joi.string().valid("Fresher", "Junior", "Mid", "Senior", "Lead")
    )
    .optional(),
  salaryMin: Joi.number().optional().min(0),
  salaryMax: Joi.number().optional().min(0),
  salaryCurrency: Joi.string().optional(),
  locations: Joi.array().items(Joi.string().trim()).optional(),
  frequency: Joi.string()
    .valid(...Object.values(AlertFrequency))
    .optional(),
  status: Joi.string()
    .valid("active", "paused", "disabled")
    .optional(),
  emailNotifications: Joi.boolean().optional(),
});
