import { Resend } from "resend";
export const resend = new Resend(process.env.RESEND_API_KEY || "re_8P97TTfb_3nHvaa6rqcSrNspLJdBdttk6");