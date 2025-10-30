require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

(async () => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not set in environment or .env');
      process.exit(2);
    }

    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('Calling listModels()...');
    const models = await client.listModels();
    // Print a compact list of model ids/names
    if (Array.isArray(models)) {
      console.log('Models:');
      models.forEach((m) => {
        console.log('-', m.name || m.id || JSON.stringify(m));
      });
    } else {
      console.log(JSON.stringify(models, null, 2));
    }
  } catch (e) {
    console.error('Error listing models:', e);
    process.exit(1);
  }
})();
