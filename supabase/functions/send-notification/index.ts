// Supabase Edge Function for sending email notifications
// Deploy via Supabase Dashboard or CLI

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: "assignment" | "deadline";
  recipientEmail: string;
  recipientName: string;
  contentTitle: string;
  contentType: string;
  shootDate?: string;
  releaseDate?: string;
  assignerName?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const payload: NotificationRequest = await req.json();
    const { type, recipientEmail, recipientName, contentTitle, contentType, shootDate, releaseDate, assignerName } = payload;

    let subject: string;
    let htmlContent: string;

    if (type === "assignment") {
      subject = `You've been assigned: ${contentTitle}`;
      htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #183539; padding: 24px; text-align: center;">
            <h1 style="color: #e7ff01; margin: 0; font-size: 24px;">PEOPLES LEAGUE</h1>
          </div>
          <div style="padding: 32px; background: #f8f9fa;">
            <p style="font-size: 16px; color: #333;">Hey ${recipientName},</p>
            <p style="font-size: 16px; color: #333;">${assignerName || 'A team member'} assigned you to a new ${contentType} project:</p>
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #e7ff01;">
              <h2 style="margin: 0 0 12px 0; color: #183539;">${contentTitle}</h2>
              ${shootDate ? `<p style="margin: 4px 0; color: #666;"><strong>Shoot Date:</strong> ${new Date(shootDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>` : ''}
              ${releaseDate ? `<p style="margin: 4px 0; color: #666;"><strong>Release Date:</strong> ${new Date(releaseDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>` : ''}
            </div>
            <a href="https://peoples-league-calendar.vercel.app" style="display: inline-block; background: #e7ff01; color: #183539; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">View in Calendar</a>
          </div>
          <div style="padding: 16px; text-align: center; color: #999; font-size: 12px;">
            Peoples League Content Calendar
          </div>
        </div>
      `;
    } else if (type === "deadline") {
      subject = `Reminder: ${contentTitle} releases soon`;
      htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #183539; padding: 24px; text-align: center;">
            <h1 style="color: #e7ff01; margin: 0; font-size: 24px;">PEOPLES LEAGUE</h1>
          </div>
          <div style="padding: 32px; background: #f8f9fa;">
            <p style="font-size: 16px; color: #333;">Hey ${recipientName},</p>
            <p style="font-size: 16px; color: #333;">Just a heads up - this ${contentType} project is releasing soon:</p>
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h2 style="margin: 0 0 12px 0; color: #183539;">${contentTitle}</h2>
              ${releaseDate ? `<p style="margin: 4px 0; color: #666;"><strong>Release Date:</strong> ${new Date(releaseDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>` : ''}
            </div>
            <a href="https://peoples-league-calendar.vercel.app" style="display: inline-block; background: #e7ff01; color: #183539; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">View in Calendar</a>
          </div>
          <div style="padding: 16px; text-align: center; color: #999; font-size: 12px;">
            Peoples League Content Calendar
          </div>
        </div>
      `;
    } else {
      throw new Error("Invalid notification type");
    }

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Peoples League <notifications@peoplesleaguegolf.com>",
        to: [recipientEmail],
        subject,
        html: htmlContent,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
