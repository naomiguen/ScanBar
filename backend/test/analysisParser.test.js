const { expect } = require('chai');
const { cleanAndParseAnalysisText } = require('../utils/analysisParser');

describe('cleanAndParseAnalysisText', () => {
  it('returns object unchanged (but normalized) when passed an object', () => {
    const input = {
      summary: 'Singkat',
      risks: ['Diabetes', 'Obesitas'],
      warnings: ['Jangan berlebihan'],
      recommendations: ['Buah', 'Sayur'],
      disclaimer: 'Bukan saran medis'
    };
    const out = cleanAndParseAnalysisText(input);
    expect(out).to.be.an('object');
    expect(out.warnings).to.be.an('array').that.includes('Jangan berlebihan');
    expect(out.risks).to.have.length(2);
  });

  it('parses fenced JSON string and normalizes arrays', () => {
    const json = JSON.stringify({
      summary: 'Ringkas',
      risks: ['Hipertensi'],
      warnings: 'Tidak sehat jika dikonsumsi berlebihan; Hindari jika punya kondisi X',
      recommendations: 'Alternatif A\nAlternatif B',
      disclaimer: 'Ini bukan pengganti dokter'
    });
    const fenced = "```json\n" + json + "\n```";
    const out = cleanAndParseAnalysisText(fenced);
    expect(out).to.be.an('object');
    expect(out.warnings).to.be.an('array');
    expect(out.warnings[0]).to.equal('Tidak sehat jika dikonsumsi berlebihan');
    expect(out.recommendations).to.be.an('array').that.includes('Alternatif A');
  });

  it('parses raw JSON string without fences', () => {
    const raw = JSON.stringify({ warnings: ['Satu peringatan', 'Peringatan dua'] });
    const out = cleanAndParseAnalysisText(raw);
    expect(out).to.be.an('object');
    expect(out.warnings).to.be.an('array').with.length(2);
  });

  it('returns original cleaned text when JSON parse fails', () => {
    const broken = "This is not JSON and cannot be parsed";
    const out = cleanAndParseAnalysisText(broken);
    expect(out).to.be.a('string');
    expect(out).to.equal(broken);
  });
});
