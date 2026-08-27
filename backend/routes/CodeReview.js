const Groq = require("groq-sdk");
const express = require("express");
const router = express.Router();
require("dotenv").config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const REVIEW_PROMPT = `You are a senior code reviewer. Analyze the following code and provide a structured review. Format your response in markdown with these sections:

## 🔍 Code Review

### Issues Found
List any bugs, logic errors, or critical issues. If none, say "No critical issues found."

### Time Complexity
Analyze the time complexity (Big O).

### Space Complexity
Analyze the space complexity (Big O).

### Improvements
Suggest concrete improvements with code examples where helpful.

### Rating
Give a rating out of 10 with a brief justification.

Keep your review concise and actionable. Focus on what matters most.`;

router.post("/review", async (req, res) => {
  try {
    const { code, language, problemContext } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ error: "No code provided for review" });
    }

    const userMessage = `${REVIEW_PROMPT}\n\nLanguage: ${language || "Unknown"}\n${problemContext ? `Problem: ${problemContext}\n` : ""}\nCode:\n\`\`\`\n${code}\n\`\`\``;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 2048,
    });

    const review = chatCompletion.choices[0]?.message?.content || "No review generated.";

    res.json({ review });
  } catch (error) {
    console.error("Code review error:", error);
    res.status(500).json({ error: "Failed to generate code review" });
  }
});

module.exports = router;
