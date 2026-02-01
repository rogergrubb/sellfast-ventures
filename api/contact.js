export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { name, email, firm, message } = await req.json();

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
            <p style="color: #666; font-size: 12px;">Sent from ventures.sellfast.now</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
