from __future__ import annotations

import httpx

from app.core.config import get_settings


class ClaudeClientError(RuntimeError):
    pass


async def request_claude_json(prompt: str) -> str:
    settings = get_settings()
    if not settings.anthropic_api_key:
        raise ClaudeClientError("ANTHROPIC_API_KEY is not configured")

    payload = {
        "model": settings.anthropic_model,
        "max_tokens": 1200,
        "temperature": 0.4,
        "system": "You return only valid JSON. Do not include markdown fences or commentary.",
        "messages": [{"role": "user", "content": prompt}],
    }
    headers = {
        "x-api-key": settings.anthropic_api_key,
        "anthropic-version": settings.anthropic_version,
        "content-type": "application/json",
        "accept": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=settings.anthropic_timeout_seconds) as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages", json=payload, headers=headers
            )
            response.raise_for_status()
    except httpx.HTTPError as exc:
        raise ClaudeClientError(f"Claude request failed: {exc}") from exc

    data = response.json()
    content = data.get("content") or []
    texts = [block.get("text", "") for block in content if block.get("type") == "text"]
    text = "".join(texts).strip()
    if not text:
        raise ClaudeClientError("Claude response did not contain text content")
    return text
