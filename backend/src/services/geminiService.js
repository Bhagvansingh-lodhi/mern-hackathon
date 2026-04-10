const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = "gemini-3.1-flash-lite-preview";
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function createGeminiError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function askGemini(prompt) {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      lastError = err;
      const statusCode = err?.status;
      const isRetryable = RETRYABLE_STATUS_CODES.has(statusCode);

      console.error(`Gemini API error on attempt ${attempt}:`, err);

      if (!isRetryable || attempt === 3) {
        break;
      }

      await delay(750 * attempt);
    }
  }

  const statusCode = lastError?.status;

  if (statusCode === 503) {
    throw createGeminiError(
      "AI service is temporarily busy. Please try again in a moment.",
      503
    );
  }

  if (statusCode === 429) {
    throw createGeminiError(
      "AI service rate limit reached. Please wait a bit and try again.",
      429
    );
  }

  throw createGeminiError("Failed to fetch response from Gemini", statusCode || 500);
}

module.exports = askGemini;
