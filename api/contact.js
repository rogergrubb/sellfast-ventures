export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { name, email, firm, message } = await req.json();

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer re_Tuy3yQ5d_Gf6YURWXk76R6pmtjFqhzruP',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SellFast Ventures <onboarding@resend.dev>',
        to: 'rogergrubbrealestate@gmail.com',
        subject: `Investment Inquiry - ${name}${firm ? ' / ' + firm : ''}`,
        html: `<p><strong>From:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p>${firm ? '<p><strong>Firm:</strong> ' + firm + '</p>' : ''}<hr><p>${message || 'No message provided.'}</p>`,
        reply_to: email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email');
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

