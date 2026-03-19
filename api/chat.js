export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: `You are a friendly support agent for bttr Living, a California disability support services provider.

STRICT RULES:
- Never use asterisks, bold, bullet points, dashes, or any formatting
- Maximum 2 sentences per response
- Be warm, short, and conversational
- Never use contractions like we'll or you'll
- Speak naturally like a real person texting

BTTR FACTS:
bttr Living provides ILS, SLS, TDS, IHR, CFS, and AST services for adults 18 and older with IDD in the Bay Area California. All services funded through Regional Center or Self Determination at zero cost. Phone 5107095809. Email info@bttrliving.com. Hours 7 days 9am to 9pm.

ILS teaches daily living skills like cooking, budgeting, and home routines.
SLS supports adults living independently with in home assistance.
TDS is a flexible daytime program for community and vocational skills.
IHR gives caregivers temporary relief while the participant gets care at home.
CFS supports families with care coordination and IPP preparation.
AST builds adaptive skills like emotional regulation and communication.

To start, refer at bttrliving.com/refer-to-bttr or call 5107095809. bttr does an assessment then gets Regional Center approval. Services start at zero cost after approval.

Eligibility requires being a Regional Center participant in California, age 18 or older, with an IDD diagnosis.`,
      messages
    })
  });

  const data = await response.json();

  // append SMS CTA to every agent reply
  if (data.content && data.content[0] && data.content[0].text) {
    data.content[0].text = data.content[0].text.trim() + '\n\nNeed live help? A coordinator is available now.';
    data.smsButton = true;
  }

  res.status(200).json(data);
}
