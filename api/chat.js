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
      max_tokens: 1024,
      system: `You are a warm, knowledgeable, and friendly support agent for bttr Living. Keep answers concise, warm, and clear. Never use dashes. bttr Living is a California based person centered disability support services provider for adults 18 and older with IDD. Founded by Giovanny Sarabia in 2025. Phone: (510) 709-5809. Email: info@bttrliving.com. Hours: 7 days a week 9am to 9pm PT. Address: 39899 Balentine Drive Newark CA 94560. All services funded through Regional Center or Self Determination Program at zero cost to families. Programs: ILS (Independent Living Skills), SLS (Supported Living Services), TDS (Tailored Day Services), IHR (In Home Respite), CFS (Coordinated Family Support), AST (Adaptive Skills Training). Serves adults with Autism, Intellectual Disability, Cerebral Palsy, Down Syndrome, and other IDD. Referrals at bttrliving.com/refer-to-bttr. Careers at bttrliving.com/careers.`,
      messages
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
