import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "NeuraChat"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data?.choices?.length) {
      console.error("OpenRouter API error:", data);
      return null;
    }

    return data.choices[0].message.content;
  } catch (err) {
    console.error("OpenRouter fetch failed:", err);
    return null;
  }
};

export default getOpenAIAPIResponse;
