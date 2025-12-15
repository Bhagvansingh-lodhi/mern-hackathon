const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function askGemini(prompt) {
  try {
    // Use a valid model name
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);

    // Safely return text
    return result.response.text();
  } catch (err) {
    console.error("Gemini API error:", err);
    throw new Error("Failed to fetch response from Gemini");
  }
}

module.exports = askGemini;