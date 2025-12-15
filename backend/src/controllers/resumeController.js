const askGemini = require('../services/geminiService');

exports.analyze = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Resume text is required" });
    }

    const prompt = `
You are an expert technical recruiter and ATS system.

Analyze the resume below and return ONLY valid JSON.
No markdown. No explanation.

Resume:
${text}

JSON FORMAT:
{
  "overallScore": 0,
  "strengths": [],
  "weaknesses": [],
  "missingKeywords": [],
  "improvements": [],
  "summary": ""
}
`;

    const aiText = await askGemini(prompt);

    let structured;
    try {
      structured = JSON.parse(aiText);
    } catch {
      structured = {
        overallScore: null,
        strengths: [],
        weaknesses: [],
        missingKeywords: [],
        improvements: [],
        summary: aiText
      };
    }

    res.json({
      success: true,
      aiGenerated: true,
      data: structured
    });

  } catch (error) {
    console.error("Resume AI Error:", error);
    res.status(500).json({ message: "Resume analysis failed" });
  }
};
