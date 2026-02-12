
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeTradingBehavior = async (base64Image: string): Promise<AnalysisResult> => {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    你是一位在股市摸爬滚打30年的资深职业交易员，性格古怪、言语犀利、毒舌且直击要害。
    你的任务是分析用户上传的交易记录截图（可能是成交明细、持仓或者盈亏曲线）。
    
    分析维度包括：
    1. 交易频率：是否过度交易。
    2. 买卖时机：是否典型的追涨杀跌。
    3. 止损意识：是否有死扛亏损的行为。
    4. 仓位控制：是否满仓梭哈或毫无节奏。
    
    输出要求：
    - 语气：必须极其辛辣、扎心，用幽默但刻薄的语言嘲讽这种不成熟的交易行为。
    - 评价：给出一个“交易段位”称号（如：提款机、情绪化小散、反向风向标、慈善家）。
    - 格式：严格按照提供的JSON模式输出。
  `;

  const prompt = "请分析这张交易记录截图，给出最毒舌、最扎心的点评。";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "交易成熟度分数，0-100" },
            title: { type: Type.STRING, description: "扎心的称号" },
            tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "行为标签" },
            roast: { type: Type.STRING, description: "一段辛辣扎心的总评" },
            behaviorAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  point: { type: Type.STRING, description: "痛点名称" },
                  description: { type: Type.STRING, description: "具体扎心描述" }
                }
              }
            },
            suggestion: { type: Type.STRING, description: "最后的一句嘲讽式建议" }
          },
          required: ["score", "title", "tags", "roast", "behaviorAnalysis", "suggestion"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("AI没有返回分析结果");
    
    return JSON.parse(resultText) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("鉴定失败，可能你的交易记录太离谱，连AI都看呆了。");
  }
};
