---
headline: 'Hybrid retrieval'
standfirst: 'Hybrid retrieval runs a keyword search and a vector search over the same documents and merges the two ranked lists, so a query can match words or meaning.'
format: term
section: ai
overlap: ['AI', 'Engineering']
published: 2026-10-30
status: draft
written_by: claude
related: ['rag']
sources:
  - title: 'Karpukhin et al., Dense Passage Retrieval for Open-Domain Question Answering (arXiv 2004.04906)'
    url: 'https://arxiv.org/abs/2004.04906'
  - title: 'Cormack, Clarke and Buettcher, Reciprocal Rank Fusion outperforms Condorcet and individual Rank Learning Methods (SIGIR 2009)'
    url: 'https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf'
---

Hybrid retrieval runs a keyword search and a vector (embedding) search over the same documents and merges the results into one ranked list.

## Example

A support bot gets the query "error E1042 after upgrade". Keyword search (for example BM25) finds the one page that contains the code E1042. Vector search finds pages about upgrade failures that never use that code. Merging both lists puts the exact match and the related pages in front of the model.

## How it works

The two methods fail in different places. Keyword search matches exact strings such as product codes and names but misses paraphrases. Dense retrieval, as in the Dense Passage Retrieval paper, matches meaning but can miss rare exact terms. [[CONFIRM]]

A common way to merge the lists is Reciprocal Rank Fusion, which scores each document by its rank in every list, so the raw scores of the two searches never need to be compared. The merged list then goes to the generator in a RAG system, sometimes after a reranking step. [[CONFIRM]]
