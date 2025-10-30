const { expect } = require('chai');
const { generateHeuristicAnalysis } = require('../utils/heuristic');

describe('generateHeuristicAnalysis', () => {
  it('returns heuristic with high sugar producing diabetes risk', () => {
    const res = generateHeuristicAnalysis('Soda', 120, 0, 10.9, 0, 10.9, 0);
    expect(res).to.be.an('object');
    expect(res.source).to.equal('heuristic');
    expect(res.risks).to.include('Diabetes tipe 2');
    expect(res.warnings).to.be.an('array').that.is.not.empty;
  });

  it('marks low-calorie low-sugar product as relatively low', () => {
    const res = generateHeuristicAnalysis('Air Mineral', 0, 0, 0, 0, 0, 0);
    expect(res.summary).to.match(/rendah kalori|Netral|relatif rendah/i);
    expect(res.risks).to.be.an('array').that.is.empty;
  });

  it('includes hipertensi risk when salt is high', () => {
    const res = generateHeuristicAnalysis('Snack', 200, 2, 20, 10, 2, 1.0);
    expect(res.risks).to.include('Hipertensi');
  });
});
