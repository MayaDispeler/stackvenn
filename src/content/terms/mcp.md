---
headline: 'MCP (Model Context Protocol)'
standfirst: 'MCP is an open protocol that lets an AI application connect to outside tools and data through one standard interface, so each integration is built once.'
format: term
section: ai
overlap: ['AI', 'Engineering']
published: 2026-10-30
status: draft
written_by: claude
related: ['token-budget']
sources:
  - title: 'Model Context Protocol: documentation'
    url: 'https://modelcontextprotocol.io'
  - title: 'Anthropic: Introducing the Model Context Protocol'
    url: 'https://www.anthropic.com/news/model-context-protocol'
---

MCP (Model Context Protocol) is an open protocol that lets an AI application talk to outside tools and data sources through one standard interface.

## Example

A coding assistant needs to read your GitHub issues. Without MCP, its makers write a GitHub integration for that one assistant. With MCP, someone writes a GitHub MCP server once, and any assistant that speaks MCP (a client) can connect to it and call the tools it exposes.

## How it works

Anthropic introduced MCP in November 2024 and published it as an open standard. The protocol has two sides. An MCP server exposes capabilities such as tools the model can call, resources it can read and prompts it can reuse. An MCP client, built into the host application, discovers those capabilities and passes them to the model.

With one shared protocol, each tool ships one server and each application ships one client, instead of every application building its own connector to every tool. [[CONFIRM]]
