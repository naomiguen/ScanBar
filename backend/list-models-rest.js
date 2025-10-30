require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY not set in environment or .env');
  process.exit(2);
}

const fetch = global.fetch || require('node-fetch');
const base = 'https://generativelanguage.googleapis.com';

async function tryList(version) {
  const url = `${base}/${version}/models`;
  try {
    console.log(`Calling ${url} ...`);
    const res = await fetch(url, { headers: { 'x-goog-api-key': apiKey } });
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      console.log(`${version} response:`, JSON.stringify(json, null, 2));
    } catch (e) {
      console.log(`${version} non-json response:`, text);
    }
  } catch (e) {
    console.error(`Error calling ${url}:`, e);
  }
}

(async () => {
  await tryList('v1');
  await tryList('v1beta');
})();
