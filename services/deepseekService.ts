import { AnalysisResult } from "../types";

const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY as string | undefined;

if (!apiKey) {
  // 在浏览器环境下无法安全存放密钥，这里仅作开发期提示
  console.warn("DeepSeek API key is not set. Please configure VITE_DEEPSEEK_API_KEY in your .env file.");
}

export const analyzeTradingBehavior = async (base64Image: string): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("后端没有正确配置 DeepSeek API Key，请联系开发者检查环境变量 VITE_DEEPSEEK_API_KEY。");
  }

  const systemInstruction = `
你是一位在股市摸爬滚打30年的资深职业交易员，性格古怪、言语犀利、毒舌且直击要害。
你的任务是基于用户提供的交易记录信息，分析其交易行为（可能来自成交明细、持仓或者盈亏曲线截图中包含的内容）。

分析维度包括：
1. 交易频率：是否过度交易。
2. 买卖时机：是否典型的追涨杀跌。
3. 止损意识：是否有死扛亏损的行为。
4. 仓位控制：是否满仓梭哈或毫无节奏。

输出要求（非常重要）：
- 语气：必须极其辛辣、扎心，用幽默但刻薄的语言嘲讽这种不成熟的交易行为。
- 评价：给出一个“交易段位”称号（如：提款机、情绪化小散、反向风向标、慈善家）。
- 只输出 JSON，不要包含任何多余的文字、解释或 Markdown。
- JSON 结构必须为：
  {
    "score": number,               // 0-100，交易成熟度分数
    "title": string,               // 扎心的称号
    "tags": string[],              // 行为标签
    "roast": string,               // 一段辛辣扎心的总评
    "behaviorAnalysis": [          // 若干个具体行为分析点
      {
        "point": string,
        "description": string
      }
    ],
    "suggestion": string           // 最后的一句嘲讽式建议
  }
- 确保返回的 JSON 可以被直接 JSON.parse，不要出现注释、额外字段或尾逗号。
  `;

  const prompt = `
现在请你像资深毒舌交易员一样，分析这位用户的交易行为，并严格按照系统提示中的 JSON 结构输出结果。

说明：
- 你会收到一段该用户交易记录截图的 base64 编码字符串（image/jpeg）。
- 你可以假设自己已经完整“看懂”了这张截图所包含的交易信息，然后据此给出最扎心的评价和建议。
- 不要在返回内容中描述 base64 字符串本身，也不要解释图片内容，只需要输出分析结果 JSON。

开始你的灵魂拷问吧。
`;

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemInstruction },
          {
            role: "user",
            content: `${prompt}\n\n用户交易记录截图的 base64（前几千个字符，供你“想象”使用）：\n${base64Image.slice(
              0,
              4000
            )}`,
          },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("DeepSeek API error:", response.status, text);
      throw new Error("鉴定失败，AI 那边也被你的交易行为整破防了。");
    }

    const data: any = await response.json();
    const resultText: string | undefined =
      data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.delta?.content;

    if (!resultText) {
      throw new Error("AI 没有返回分析结果，请稍后再试。");
    }

    // DeepSeek 按 OpenAI 兼容格式返回，这里要求它只输出 JSON 字符串
    const parsed = JSON.parse(resultText) as AnalysisResult;
    return parsed;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("鉴定失败，可能你的交易记录太离谱，连 AI 都看呆了。");
  }
};

