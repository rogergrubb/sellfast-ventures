export const config = {
  runtime: "edge",
};

export default async function handler(request) {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { 
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { name, email, firm, message } = await request.json();

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer re_Tuy3yQ5d_Gf6YURWXk76R6pmtjFqhzruP",
      },
      body: JSON.stringify({
        from: "SellFast Ventures <onboarding@resend.dev>",
        to: "rogergrubbrealestate@gmail.com",
        reply_to: email,
        subject: `Investment Inquiry - ${name}${firm ? " / " + firm : ""}`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px;">
            <h2 style="color: #d4a853;">New Investment Inquiry</h2>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${firm ? `<p><strong>Firm:</strong> ${firm}</p>` : ""}
            <hr style="border: none; border-top: 1px solid #333; margin: 20px 0;">
            <p style="white-space: pre-wrap;">${message}</p>
            <hr style="border: none; border-top: 1px solid #333; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">Sent from SellFast Ventures</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend error:", error);
      throw new Error(error);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
    });
  }
}
