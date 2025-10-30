const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
const path = require('path');
const { expect } = require('chai');

describe('/api/foods/analyze integration', () => {
  let app;
  before(() => {
    // 1) Monkeypatch auth middleware before requiring the route so router uses the fake auth
    const authPath = require.resolve(path.join(__dirname, '..', 'middleware', 'auth.js'));
    require.cache[authPath] = {
      id: authPath,
      filename: authPath,
      loaded: true,
      exports: function (req, res, next) {
        // Fake user attached to request for protected routes
        req.user = { id: '507f1f77bcf86cd799439011' };
        return next();
      },
    };

    // Now require the foods router (it will pick up the patched auth)
    const foodsRouter = require(path.join(__dirname, '..', 'routes', 'foods'));

    // Create express app and mount the router. We'll inject mocks per-test by calling
    // foodsRouter.__setModelForTests(...) inside each it() block.
    app = express();
    app.use(bodyParser.json());
    app.use('/api/foods', foodsRouter);
  });
  const basePayload = {
    productName: 'Produk Test',
    calories: 200,
    protein: 5,
    carbs: 30,
    fat: 8,
    sugar: 10,
    salt: 0.5
  };

  it('returns normalized analysis object when model returns fenced JSON', async () => {
    // Arrange: inject mock that returns code-fenced JSON
    const json = JSON.stringify({
      summary: 'Test summary',
      warnings: ['Hati-hati dengan garam tinggi'],
      risks: ['Hipertensi'],
      recommendations: ['Pilih buah segar', 'Ganti dengan air putih'],
      disclaimer: 'Ini bukan saran medis',
      dietSuitability: 'Netral'
    });
    const mockModel = {
      generateContent: async () => ({ response: { text: () => '```json\n' + json + '\n```' } })
    };
    foodsRouter.__setModelForTests(mockModel);

    const res = await request(app)
      .post('/api/foods/analyze')
      .send(basePayload)
      .set('Accept', 'application/json')
      .expect(200);

    expect(res.body).to.have.property('analysis');
    const analysis = res.body.analysis;
    expect(analysis).to.be.an('object');
    expect(analysis.warnings).to.be.an('array');
    expect(analysis.warnings[0]).to.equal('Hati-hati dengan garam tinggi');
    expect(analysis.risks).to.be.an('array').that.includes('Hipertensi');
  });

  it('handles model returning raw JSON string (no fences)', async () => {
    const json = JSON.stringify({ warnings: ['Satu peringatan'], risks: ['Obesitas'] });
    const mockModel = { generateContent: async () => ({ response: { text: () => json } }) };
    foodsRouter.__setModelForTests(mockModel);

    const res = await request(app)
      .post('/api/foods/analyze')
      .send(basePayload)
      .set('Accept', 'application/json')
      .expect(200);

    expect(res.body.analysis).to.be.an('object');
    expect(res.body.analysis.warnings).to.be.an('array').that.includes('Satu peringatan');
  });

  it('handles model returning non-JSON plain text (fallback to string)', async () => {
    const plain = 'Ini bukan JSON tapi model memberi saran singkat. Hati-hati!';
    const mockModel = { generateContent: async () => ({ response: { text: () => plain } }) };
    foodsRouter.__setModelForTests(mockModel);

    const res = await request(app)
      .post('/api/foods/analyze')
      .send(basePayload)
      .set('Accept', 'application/json')
      .expect(200);

    // When parsing fails, the server returns cleaned string in analysis
    expect(res.body.analysis).to.be.a('string');
    expect(res.body.analysis).to.include('Ini bukan JSON');
  });

  it('handles model returning output array containing JSON string', async () => {
    const json = JSON.stringify({ warnings: ['Array warning'], risks: ['Diabetes'] });
    const mockModel = { generateContent: async () => ({ output: [json] }) };
    foodsRouter.__setModelForTests(mockModel);

    const res = await request(app)
      .post('/api/foods/analyze')
      .send(basePayload)
      .set('Accept', 'application/json')
      .expect(200);

    expect(res.body.analysis).to.be.an('object');
    expect(res.body.analysis.warnings).to.be.an('array').that.includes('Array warning');
  });

  it('handles model returning object directly', async () => {
    const obj = { warnings: ['Direct object warning'], risks: ['Heart disease'] };
    const mockModel = { generateContent: async () => obj };
    foodsRouter.__setModelForTests(mockModel);

    const res = await request(app)
      .post('/api/foods/analyze')
      .send(basePayload)
      .set('Accept', 'application/json')
      .expect(200);

    expect(res.body.analysis).to.be.an('object');
    expect(res.body.analysis.warnings).to.be.an('array').that.includes('Direct object warning');
  });
});
