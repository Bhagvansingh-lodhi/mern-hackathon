const askGemini = require('../services/geminiService');
const Roadmap = require('../models/Roadmap');

exports.generate = async (req, res) => {
  try {
    const { career } = req.body;

    if (!career) {
      return res.status(400).json({ message: "Career is required" });
    }

    const prompt = `
You are an expert career roadmap planner.

Career: ${career}

Create a 6 month roadmap.

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanations

JSON FORMAT:
{
  "career": "${career}",
  "roadmap": [
    {
      "phase": "",
      "duration": "",
      "topics": [],
      "tasks": []
    }
  ]
}
`;

    const aiText = await askGemini(prompt);

    let structured;
    try {
      structured = JSON.parse(aiText);
    } catch (err) {
      // fallback if AI breaks JSON
      structured = {
        career,
        roadmap: [],
        rawText: aiText
      };
    }

    // ✅ Save structured roadmap in DB
    const savedRoadmap = await Roadmap.create({
      career,
      content: structured
    });

    res.json({
      success: true,
      aiGenerated: true,
      data: savedRoadmap.content
    });

  } catch (error) {
    console.error("Roadmap Error:", error);
    res.status(500).json({ message: "Failed to generate roadmap" });
  }
};
