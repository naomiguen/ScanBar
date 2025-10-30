// backend/utils/analysisParser.js
// Helper to clean model output and parse to a normalized object
function cleanAndParseAnalysisText(analysisText) {
  // If not a string, return as-is (may already be an object)
  if (typeof analysisText !== 'string') return analysisText;

  // Normalize line endings and trim
  let text = analysisText.replace(/\r/g, '').trim();

  // 1) If the model wrapped JSON in a code fence like ```json ... ``` extract the inner content
  const fenceMatch = text.match(/```(?:json|js|javascript)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch && fenceMatch[1]) {
    text = fenceMatch[1].trim();
  } else {
    // 2) If there is any leading label like "JSON:" or similar, drop up to the first brace
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      text = text.slice(firstBrace, lastBrace + 1).trim();
    }
  }

  // 3) Attempt to parse JSON; return parsed object on success, otherwise return cleaned string
  try {
    const parsed = JSON.parse(text);

    // Normalize parsed object to ensure arrays where expected
    const toArray = (v) => {
      if (!v && v !== 0) return [];
      if (Array.isArray(v)) return v.map(x => (typeof x === 'string' ? x.trim() : x));
      if (typeof v === 'string') {
        // First try splitting by new lines or bullets
        let parts = v.split(/\r?\n|[\u2022•\-–—]\s*|;\s*/).map(s => s.trim()).filter(Boolean);
        if (parts.length > 1) return parts;
        // If still single chunk, try comma separation
        parts = v.split(/,\s*/).map(s => s.trim()).filter(Boolean);
        if (parts.length > 1) return parts;
        // Give up and return the full string as single item
        return [v.trim()];
      }
      // Fallback: coerce to string array
      return [String(v)];
    };

    const normalize = (obj) => {
      if (!obj || typeof obj !== 'object') return obj;
      // Spread original object first, then override normalized fields so normalization wins
      return {
        ...obj,
        summary: typeof obj.summary === 'string' ? obj.summary.trim() : (obj.summary ?? ''),
        risks: toArray(obj.risks ?? obj.risk ?? obj.Risks),
        warnings: toArray(obj.warnings ?? obj.warning ?? obj.Warnings),
        dietSuitability: typeof obj.dietSuitability === 'string' ? obj.dietSuitability.trim() : (obj.dietSuitability ?? ''),
        recommendations: toArray(obj.recommendations ?? obj.recs ?? obj.recommendation),
        disclaimer: typeof obj.disclaimer === 'string' ? obj.disclaimer.trim() : (obj.disclaimer ?? ''),
      };
    };

    return normalize(parsed);
  } catch (e) {
    return text;
  }
}

module.exports = { cleanAndParseAnalysisText };
