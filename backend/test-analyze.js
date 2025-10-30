require('dotenv').config();
const axios = require('axios');

(async () => {
  try {
    const payload = {
      productName: 'Test Bar',
      calories: 250,
      protein: 5,
      carbs: 30,
      fat: 12,
      sugar: 10,
      salt: 0.5,
    };

    console.log('Posting to /api/foods/analyze-test...');
  const res = await axios.post('http://localhost:3000/api/foods/analyze-test', payload, { timeout: 120000 });
    console.log('Status:', res.status);
    console.log('Response data:', JSON.stringify(res.data, null, 2));
  } catch (e) {
    if (e.response) {
      console.error('HTTP error status:', e.response.status);
      console.error('Response data:', e.response.data);
    } else {
      console.error('Request error:', e.message);
    }
    process.exit(1);
  }
})();
