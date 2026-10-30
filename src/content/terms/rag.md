---
headline: 'RAG (retrieval-augmented generation)'
standfirst: 'RAG is a method where a language model first retrieves relevant documents, then writes its answer using them, so replies can draw on facts outside its training.'
format: term
section: ai
overlap: ['AI', 'Engineering']
published: 2026-10-30
status: draft
written_by: claude
related: ['hybrid-retrieval', 'llm-as-judge', 'token-budget']
sources:
  - title: 'Lewis et al., Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (arXiv 2005.11401)'
    url: 'https://arxiv.org/abs/2005.11401'
---

RAG (retrieval-augmented generation) is a method where a language model retrieves relevant documents first and then writes its answer using them.

## Example

An HR assistant gets the question "How many leave days carry over?". The system searches the company's policy documents, finds the paragraph on carry-over, and places it in the prompt next to the question. The model answers from that paragraph and can cite it.

## How it works

The term comes from a 2020 paper by Lewis and colleagues, which paired a neural retriever over Wikipedia with a sequence-to-sequence generator. Most RAG systems today follow the same two steps: a retriever picks a handful of passages for the query, and the generator conditions its answer on them. [[CONFIRM]]

RAG lets you change what a system knows by changing the document store, without retraining the model. The answer depends on the passages the retriever finds, which is why retrieval quality gets so much attention. [[CONFIRM]]
