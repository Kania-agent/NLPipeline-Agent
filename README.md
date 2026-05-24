# NLPipeline Agent

A fully functional, rule-based NLP text processor running entirely in the browser. No external libraries or APIs required — all processing is done with vanilla JavaScript.

## Features

### 📝 NLP Processing Pipeline

The application runs a 5-stage NLP pipeline on any input text:

1. **🔤 Tokenization** — Splits text into individual words and punctuation with character positions
2. **🏷️ POS Tagging** — Tags each word with its part-of-speech (nouns, verbs, adjectives, adverbs, determiners, prepositions, pronouns, conjunctions) using rule-based heuristics and a built-in lexicon
3. **🔍 Named Entity Recognition** — Extracts person names, organizations, and locations using pattern matching, title detection, and known entity lists
4. **😊 Sentiment Analysis** — Keyword-based sentiment scoring with support for negation handling, intensifiers, and contextual modifiers
5. **📝 Extractive Summary** — Scores sentences by multiple heuristics (position, length, entities, sentiment, verbs) and extracts the most informative ones

### 🎨 Visual Pipeline

Each processing stage is visualized with an animated pipeline showing:
- Real-time stage status (waiting → processing → done)
- Smooth animations and transitions
- Color-coded results at each stage

### 📊 Rich Results Display

- **Tokenization**: Visual token grid with character positions
- **POS Tagging**: Color-coded token chips + bar chart distribution
- **NER**: Entity cards with type badges (Person/Organization/Location) and context snippets
- **Sentiment**: Visual gauge, score display, and categorized word lists
- **Summary**: Sentence highlighting with importance scores and extracted summary

## Usage

1. Open `index.html` in any modern web browser
2. Type or paste text into the input area
3. Click **▶ Process Text** (or press `Ctrl+Enter`)
4. Watch the pipeline process each stage with visual feedback
5. Review detailed results for each NLP stage

### Sample Texts

Click **📄 Load Sample** to load pre-written sample texts that demonstrate various NLP capabilities.

## Technical Details

### Architecture

- **Zero dependencies** — No external libraries, frameworks, or APIs
- **Pure vanilla JS** — ~430 lines of JavaScript
- **Modern CSS** — Dark theme with CSS custom properties, animations, and responsive design
- **Single HTML file** — Fully self-contained application

### NLP Components

| Stage | Method | Description |
|-------|--------|-------------|
| Tokenizer | Regex-based | Splits on word boundaries, preserves punctuation |
| POS Tagger | Lexicon + rules | 800+ word lexicon, morphological suffix rules |
| NER | Pattern matching | Title detection, name lookup, org/loc databases |
| Sentiment | Keyword scoring | 150+ sentiment words, negation/intensifier handling |
| Summary | Multi-heuristic | Position, length, entity density, sentiment, action |

### Sentiment Scoring

- Each positive word contributes +1 (or +1.5 with intensifier)
- Each negative word contributes -1 (or -1.5 with intensifier)
- Negation reverses the polarity of the following sentiment word
- Final score is normalized to [-1, 1] range
- Labels: Positive (>0.15), Negative (<-0.15), Neutral

### Entity Recognition Rules

1. **Title + Name** patterns (e.g., "Dr. Sarah Johnson")
2. **Known first names** followed by capitalized words
3. **Known organizations** (Google, Microsoft, NASA, etc.)
4. **Known locations** (New York, London, Tokyo, etc.)
5. **Capitalized word heuristics** for unknown entities

## Files

- `index.html` — Main HTML structure with semantic markup
- `style.css` — Dark theme with responsive design, animations
- `app.js` — All NLP processing logic and UI rendering
- `README.md` — This file

## Browser Compatibility

Works in all modern browsers:
- Chrome / Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT
