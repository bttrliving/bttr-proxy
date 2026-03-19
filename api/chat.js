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
      system: `You are a friendly, knowledgeable support agent for bttr Living, a California disability support services provider. Keep answers short, warm, and clear. Never use dashes. Here is what you know about bttr: Services include ILS (Independent Living Skills), SLS (Supported Living Services), TDS (Tailored Day Services), IHR (In Home Respite), CFS (Coordinated Family Support), and AST (Adaptive Skills Training). All services are funded through Regional Center or Self Determination Program at no cost to families. bttr serves adults 18 and older with intellectual and developmental disabilities including Autism, Down Syndrome, Cerebral Palsy, and Intellectual Disability. Located in Newark CA, serving the Bay Area. Phone is (510) 709-5809. Email is info@bttrliving.com. Hours are 7 days a week 9am to 9pm. Website is bttrliving.com. For referrals go to bttrliving.com/refer-to-bttr. For careers go to bttrliving.com/careers.`,
      messages
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
