---
headline: 'LLM-as-a-judge'
standfirst: 'LLM-as-a-judge means using a language model to grade the outputs of another model against a rubric or a reference, as a cheaper stand-in for human review.'
format: term
section: ai
overlap: ['AI', 'Engineering']
published: 2026-10-30
status: draft
written_by: claude
related: ['rag']
sources:
  - title: 'Zheng et al., Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena (arXiv 2306.05685)'
    url: 'https://arxiv.org/abs/2306.05685'
---

LLM-as-a-judge means using a language model to grade the outputs of another model, against a rubric, a reference answer or a second candidate.

## Example

You change the prompt of a RAG assistant and want to know if answers got better. You run the same set of test questions through the old and new versions, then ask a judge model, for each pair, which answer is more accurate given the retrieved passages. You count the wins.

## How it works

The 2023 paper by Zheng and colleagues studied this setup on MT-Bench and Chatbot Arena. It reported that strong judge models agreed with human preferences about as often as humans agree with each other, and it named biases to watch for: position bias (favouring the answer shown first), verbosity bias (favouring longer answers) and self-enhancement bias (favouring answers the judge model wrote).

Teams use it because it scales to thousands of cases far faster than human review. Common checks include swapping the answer order and spot-checking a sample by hand. [[CONFIRM]]
