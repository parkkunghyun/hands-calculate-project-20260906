const PROMPT = `This image is dark handwritten ink on white paper.
Transcribe exactly what is written.
Return only the transcribed text. No explanation, no markdown, no quotes.
Keep math symbols as written (for example: 2 + 2).
If nothing is readable, return EMPTY.`;

const MODEL = "gemini-2.5-flash";

type GeminiResponse = {
  error?: { message?: string };
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
};

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return Response.json(
      { error: ".env에 GEMINI_API_KEY를 넣고 개발 서버를 다시 시작해 주세요." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as { image?: string };
  const image = body.image?.replace(/^data:image\/\w+;base64,/, "");
  if (!image) {
    return Response.json({ error: "이미지 데이터가 없습니다." }, { status: 400 });
  }

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: PROMPT },
              { inline_data: { mime_type: "image/png", data: image } },
            ],
          },
        ],
        generationConfig: { temperature: 0 },
      }),
    },
  );

  const data = (await geminiRes.json()) as GeminiResponse;
  if (!geminiRes.ok) {
    return Response.json(
      { error: data.error?.message ?? "Gemini 요청에 실패했습니다." },
      { status: geminiRes.status },
    );
  }

  const text = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .replace(/\s+/g, " ")
    .trim();

  if (!text || text === "EMPTY") {
    return Response.json(
      { error: "글씨를 읽지 못했습니다. 조금 더 크고 진하게 적어 보세요." },
      { status: 422 },
    );
  }

  return Response.json({ text });
}
