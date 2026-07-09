# Google AI Studio compatibility

WorldCupIQ AI's decision prompts are designed to be portable to Google AI
Studio for evaluators who want to reproduce the reasoning path without
running the full stack.

## Prompt architecture

- **System prompt**: role framing + strict JSON schema. See
  `src/lib/decision.functions.ts` (`SYSTEM_PROMPT`).
- **User prompt**: persona framing + venue context + decision request.
  See `personaPrompt()` in the same file.
- **Response format**: JSON object mode (`response_format = json_object`).

## Recommended model

`gemini-2.5-flash` for the sub-second decision path;
`gemini-2.5-pro` for the executive briefing path.

## Reproducing a run

1. Copy `SYSTEM_PROMPT` from the source into AI Studio's system field.
2. Paste the user prompt (assembled by `personaPrompt` + venue + query).
3. Enable structured JSON output.
4. Compare the returned JSON against the `DecisionResult` shape in
   `src/lib/decision.functions.ts`.