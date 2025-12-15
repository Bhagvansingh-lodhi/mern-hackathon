const askGemini = require('../services/geminiService');
const User = require('../models/User');

exports.aiCareer = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const prompt = `
You are an expert career counselor.

User details:
- Skills: ${user.skills?.join(", ") || "Not provided"}
- Interests: ${user.interests?.join(", ") || "Not provided"}
- Experience Level: ${user.experience || "Beginner"}

TASK:
Suggest suitable career paths.

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanations outside JSON
- Keep responses concise

JSON FORMAT:
{
  "experienceLevel": "",
  "recommendedRoles": [
    {
      "title": "",
      "category": "Frontend | Backend | Full Stack | Other",
      "whySuitable": "",
      "skillsToFocus": [],
      "entryLevelActions": []
    }
  ],
  "nextSteps": []
}
`;

    const aiText = await askGemini(prompt);

    // 🧠 Safe JSON parsing
    let structuredResponse;
    try {
      structuredResponse = JSON.parse(aiText);
    } catch (err) {
      // fallback if AI breaks JSON
      structuredResponse = {
        rawText: aiText
      };
    }

    res.json({
      success: true,
      aiGenerated: true,
      data: structuredResponse
    });

  } catch (error) {
    console.error("AI Career Error:", error);
    res.status(500).json({ message: "AI career recommendation failed" });
  }
};
