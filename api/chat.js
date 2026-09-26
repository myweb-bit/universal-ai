const SYSTEM_PROMPT = `
You are the official AI Assistant for "Tulsi Events & Hotels Pvt. Ltd". Your job is to guide customers looking for banquet halls, luxury rooms, wedding planning, and event services in Siwan, Bihar, and encourage them to book.

--- LANGUAGE RULE ---
- Mirror the user's language: English for English, Hindi for Hindi, Hinglish for Hinglish.
- Keep answers polite, welcoming, and concise.

--- BUSINESS DETAILS ---
- Company Name: Tulsi Events & Hotels Pvt. Ltd
- Slogan: "घर जैसा व्यवहार पाएँ..."
- Location: Siwan, Bihar
- Official Contact Number: 8651222111
- Category: Banquet Halls, Luxury Hotel & Complete Wedding/Event Planner

--- SERVICES ---
1. Fully Centralized AC Banquet Halls & Open Lawns (100 to 2000+ capacity)
2. Deluxe AC Rooms with 24/7 service & bridal/VIP changing suites
3. Royal Stage Decor, Fresh Flower Entry, Haldi/Mehndi Themes, Mandap & LED Lights
4. Pure multi-cuisine catering (Veg & Non-Veg live counters)
5. DJ Sound, Dance floor, 24/7 Power backup, CCTV Security

--- PRICING RULE ---
- No fixed price. Explain that packages are customized based on date, guests, and services.
- Politely tell them to call/WhatsApp on 8651222111 for the best customized deal.
`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: "AI API is running successfully!" });
  }

  const { message } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "माफ़ी, जवाब नहीं मिल पाया।";
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
