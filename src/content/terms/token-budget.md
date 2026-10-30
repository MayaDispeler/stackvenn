---
headline: 'Token budget'
standfirst: 'A token budget is the share of a model context window that you assign to each part of a request: instructions, retrieved text, history and output.'
format: term
section: ai
overlap: ['AI', 'Engineering']
published: 2026-10-30
status: draft
written_by: claude
related: ['rag', 'mcp']
sources:
  - title: 'Anthropic docs: Context windows'
    url: 'https://docs.anthropic.com/en/docs/build-with-claude/context-windows'
  - title: 'Anthropic docs: Token counting'
    url: 'https://docs.anthropic.com/en/docs/build-with-claude/token-counting'
---

A token budget is the number of tokens you allow each part of a request to use, inside the limit of the model's context window.

## Example

An assistant answers questions over long contracts. The team reserves a fixed slice of the window for the system prompt, a slice for chat history and a slice for the answer, and gives whatever is left to retrieved contract clauses. When the history grows past its slice, the oldest turns are summarised or dropped.

## How it works

Models read and write text as tokens, and every model has a context window: the most tokens it can handle in one request, input and output together. Instructions, tool definitions, retrieved passages, conversation history and the reply all compete for that space.

A budget makes the trade-offs explicit before the window fills up. Providers offer token-counting endpoints so you can measure a request before sending it. Most APIs bill per token, so the budget also caps spend. [[CONFIRM]]
