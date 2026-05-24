# 📝 NLPipeline-Agent

> End-to-end NLP pipeline with named entity recognition, sentiment analysis, and summarization powered by MiMo V2.5

## Why This Exists

Natural Language Processing is not a single task — it's an interconnected chain of capabilities. Tokenizing text, extracting entities, gauging sentiment, and generating summaries each require different models, different training approaches, and different evaluation metrics. Stitching these into a cohesive pipeline usually means maintaining five different model servers, dealing with five different APIs, and reconciling five different tokenization schemes.

NLPipeline-Agent unifies the entire NLP stack under a single MiMo V2.5 agent that **reasons about text holistically**. Instead of running independent models that ignore each other's outputs, the agent uses entity extraction to improve sentiment analysis (understanding that "Apple" the company is different from "apple" the fruit), and uses both to produce more grounded, factual summaries. Every stage benefits from the intelligence of every other stage.

Perfect for teams processing customer feedback at scale, analyzing legal documents, monitoring brand sentiment, or building knowledge graphs from unstructured text. NLPipeline-Agent delivers production-grade NLP without the complexity of managing a model zoo.

## Architecture

```
┌──────────┐     ┌──────────┐     ┌────────┐     ┌───────────┐     ┌─────────┐
│   TEXT   │────▶│ TOKENIZER│────▶│  NER   │────▶│ SENTIMENT │────▶│ SUMMARY │
│          │     │          │     │        │     │           │     │         │
│ • Social │     │ • BPE    │     │ • Name │     │ • Positive│     │ • Abstr │
│ • Support│     │ • Subword│     │ • Org  │     │ • Negative│     │ • Extrac│
│ • Legal  │     │ • Lemmat │     │ • Loc  │     │ • Neutral │     │ • Bullet│
│ • News   │     │ • POS    │     │ • Custom│    │ • Emotion │     │ • Key   │
└──────────┘     └──────────┘     └────────┘     └───────────┘     └─────────┘

    MiMo V2.5 Agent chains NLP stages with cross-stage context sharing
```

## Token Consumption Model

| Stage | Description | Tokens/Run | Avg Latency | Cost Estimate |
|-------|-------------|------------|-------------|---------------|
| **Tokenizer** | Tokenization, POS tagging, lemmatization, dependency parsing | 50K | 2s | $0.02 |
| **NER** | Named entity recognition, entity linking, relation extraction | 400K | 15s | $0.16 |
| **Sentiment** | Sentiment analysis, emotion detection, aspect-based sentiment | 200K | 8s | $0.08 |
| **Summary** | Abstractive summarization, key point extraction, compression | 300K | 12s | $0.12 |
| **Total** | Full NLP pipeline | **950K** | **37s** | **$0.38** |

*Token estimates for processing a 2,000-word document. Scales with input length.*

## Features

- **Holistic Text Understanding** — Each pipeline stage shares context with subsequent stages for more accurate results
- **Custom NER Training** — Define and train custom entity types with minimal labeled examples
- **Aspect-Based Sentiment** — Extracts sentiment toward specific entities, not just document-level polarity
- **Multi-Style Summarization** — Generates executive summaries, bullet points, or detailed digests as needed
- **Multi-Language Support** — Handles 30+ languages with automatic language detection
- **Streaming Processing** — Process text as it arrives for real-time social media monitoring
- **Batch Mode** — High-throughput batch processing for document archives
- **Entity Knowledge Graph** — Builds interconnected entity graphs from processed documents
- **Negation & Sarcasm Detection** — Handles linguistic nuances that trip up simpler NLP systems
- **Pipeline Customization** — Enable/disable stages, reorder processing, inject custom components

## Tech Stack

- **Runtime**: Python 3.11+
- **Agent Engine**: MiMo V2.5 (Nous Research)
- **Tokenization**: Hugging Face Tokenizers, SentencePiece
- **NER**: spaCy, Flair NER, MiMo NER fine-tuned model
- **Sentiment**: VADER, TextBlob, custom transformer classifier
- **Summarization**: BART, PEGASUS, MiMo summarization model
- **Embeddings**: sentence-transformers, OpenAI Ada
- **Core NLP**: NLTK, stanza, Hugging Face Transformers
- **API**: FastAPI with streaming SSE support
- **Storage**: PostgreSQL, Redis (caching)
- **Task Queue**: Celery for batch processing

## Quick Start

```bash
# Install NLPipeline-Agent
pip install nlpipeline-agent

# Process text through the full pipeline
nlpipeline process "Our customers love the new features but the mobile app crashes frequently."

# Run specific stages
nlpipeline tokenize "Complex linguistical analysis requires careful tokenization."
nlpipeline ner --file document.txt --custom-entities "product,feature,bug"
nlpipeline sentiment --aspect "mobile app" --input feedback.json
nlpipeline summarize --file research_paper.pdf --style bullets --max-words 200

# Start the API server
nlpipeline serve --port 8000

# Process a batch of documents
nlpipeline batch ./documents/ --output ./results/ --pipeline full
```

## Project Structure

```
NLPipeline-Agent/
├── README.md
├── pyproject.toml
├── pipelines/
│   ├── full_pipeline.yaml        # Default full pipeline config
│   ├── sentiment_only.yaml       # Sentiment-focused pipeline
│   └── custom_pipeline.yaml      # User-customizable template
├── src/
│   ├── __init__.py
│   ├── agent/
│   │   ├── pipeline.py           # MiMo V2.5 pipeline orchestrator
│   │   ├── planner.py            # Stage planning and routing
│   │   ├── reasoner.py           # Cross-stage reasoning engine
│   │   └── context.py            # Shared context manager
│   ├── tokenizer/
│   │   ├── engine.py             # Tokenization engine
│   │   ├── pos_tagger.py         # Part-of-speech tagging
│   │   ├── lemmatizer.py         # Lemmatization
│   │   └── dep_parser.py         # Dependency parsing
│   ├── ner/
│   │   ├── recognizer.py         # Named entity recognizer
│   │   ├── linker.py             # Entity linking to knowledge base
│   │   ├── relation.py           # Relation extraction
│   │   └── custom_entities.py    # Custom entity type training
│   ├── sentiment/
│   │   ├── analyzer.py           # Document-level sentiment
│   │   ├── aspect.py             # Aspect-based sentiment
│   │   ├── emotion.py            # Emotion classification
│   │   └── sarcasm.py            # Sarcasm/irony detection
│   ├── summarizer/
│   │   ├── abstractive.py        # Abstractive summarization
│   │   ├── extractive.py         # Key sentence extraction
│   │   ├── key_points.py         # Key point generation
│   │   └── compression.py        # Controlled length compression
│   └── utils/
│       ├── lang_detect.py        # Language detection
│       ├── knowledge_graph.py    # Entity graph builder
│       └── metrics.py            # Pipeline quality metrics
├── models/                       # Fine-tuned model weights
├── tests/
│   ├── test_tokenizer.py
│   ├── test_ner.py
│   ├── test_sentiment.py
│   ├── test_summarizer.py
│   └── test_integration.py
├── api/
│   └── main.py                   # FastAPI endpoints
└── Dockerfile
```

---

> Built with MiMo V2.5 — [Nous Research](https://nousresearch.com)
