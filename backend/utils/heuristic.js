// Simple heuristic analysis generator used when generative model is unavailable
function generateHeuristicAnalysis(productName = '', calories = 0, protein = 0, carbs = 0, fat = 0, sugar = 0, salt = 0) {
  // Ensure numeric values
  const cals = parseFloat(calories) || 0;
  const prot = parseFloat(protein) || 0;
  const ch = parseFloat(carbs) || 0;
  const f = parseFloat(fat) || 0;
  const s = parseFloat(sugar) || 0;
  const so = parseFloat(salt) || 0;

  // Thresholds (per 100g typical guidance)
  const HIGH_CAL = 250;
  const MODERATE_CAL = 150;
  const HIGH_SUGAR = 10; // g
  const HIGH_SALT = 0.5; // g (500 mg)
  const HIGH_FAT = 17; // g

  const risks = [];
  const warnings = [];

  if (s >= HIGH_SUGAR) {
    risks.push('Diabetes tipe 2');
    risks.push('Obesitas');
    warnings.push('Produk ini tinggi gula — batasi konsumsi.');
  }

  if (so >= HIGH_SALT) {
    if (!risks.includes('Hipertensi')) risks.push('Hipertensi');
    warnings.push('Kandungan garam tinggi — hindari jika Anda memiliki tekanan darah tinggi.');
  }

  if (f >= HIGH_FAT) {
    if (!risks.includes('Penyakit jantung')) risks.push('Penyakit kardiovaskular');
    warnings.push('Kaya lemak — konsumsi secukupnya.');
  }

  // Avoid duplicate risks and limit to 3
  const uniqueRisks = Array.from(new Set(risks)).slice(0, 3);

  // Summary logic
  let summary = 'Netral — konsumsi dalam porsi yang wajar.';
  if (cals >= HIGH_CAL || s >= HIGH_SUGAR || so >= HIGH_SALT) {
    summary = 'Produk ini cenderung tidak sehat jika dikonsumsi berlebihan.';
  } else if (cals <= MODERATE_CAL && s < HIGH_SUGAR && so < HIGH_SALT) {
    summary = 'Produk relatif rendah kalori/gula; dapat dikonsumsi lebih santai dalam porsi moderat.';
  }

  // Diet suitability
  let dietSuitability = 'Netral';
  if (ch <= 5 && s < HIGH_SUGAR) {
    dietSuitability = 'Cocok untuk diet rendah karbohidrat (low-carb).';
  } else if (s >= HIGH_SUGAR) {
    dietSuitability = 'Tidak cocok untuk diet rendah gula atau penderita diabetes.';
  } else if (so >= HIGH_SALT) {
    dietSuitability = 'Tidak cocok untuk diet rendah garam.';
  }

  // Recommendations (generic, Indonesia-focused)
  const recommendations = [
    'Ganti dengan air putih atau teh tawar untuk mengurangi gula.',
    'Pilih buah segar atau yoghurt rendah lemak sebagai alternatif yang lebih sehat.'
  ];

  const disclaimer = 'Ini adalah analisis heuristik sederhana dan bukan pengganti nasihat medis profesional.';

  return {
    summary,
    risks: uniqueRisks,
    warnings: warnings.slice(0, 2),
    dietSuitability,
    recommendations,
    disclaimer,
    source: 'heuristic'
  };
}

module.exports = { generateHeuristicAnalysis };
