// NLPipeline-Agent — NLP Pipeline Simulation
const state = {
  analyzed: false,
  currentStage: -1
};

const sampleText = `Dr. Sarah Chen, the Chief Technology Officer at DeepMind Research, published a groundbreaking paper on April 15, 2024, in the Journal of Artificial Intelligence. The paper, co-authored with Professor James Mitchell from Stanford University and Dr. Aisha Patel of MIT, presents a novel approach to few-shot learning that achieves 95.7% accuracy on the ImageNet benchmark.

The research team demonstrated that their method significantly outperforms existing techniques, reducing computational costs by 40% while maintaining state-of-the-art performance. "This represents a fundamental shift in how we think about transfer learning," explained Dr. Chen during her keynote address at NeurIPS 2024 in Vancouver, Canada.

The paper has already been cited over 200 times since its publication and has sparked extensive discussion in the machine learning community. Google Brain and OpenAI have both expressed interest in implementing the methodology in their production systems.`;

// Simple NLP simulation
const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'that', 'this', 'these', 'those', 'and', 'but', 'or', 'nor', 'not', 'so', 'if', 'than', 'too', 'very', 'just', 'about', 'its', 'it', 'their', 'they', 'we', 'he', 'she', 'her', 'his', 'our', 'my', 'your', 'who', 'whom', 'which', 'what', 'where', 'when', 'how']);

const personNames = ['Dr. Sarah Chen', 'Professor James Mitchell', 'Dr. Aisha Patel', 'Dr. Chen'];
const orgNames = ['DeepMind Research', 'Stanford University', 'MIT', 'NeurIPS', 'Google Brain', 'OpenAI', 'Journal of Artificial Intelligence'];
const locationNames = ['Vancouver', 'Canada'];
const dateExpressions = ['April 15, 2024', 'NeurIPS 2024'];

const posPatterns = {
  noun: /\b(paper|research|method|team|techniques|costs|performance|discussion|community|systems|shift|approach|learning|intelligence|benchmark|methodology|publication|method|keynote|address|citations)\b/gi,
  verb: /\b(published|presented|achieves|demonstrated|outperforms|reducing|maintaining|explained|expressed|sparked|published|cited)\b/gi,
  adj: /\b(groundbreaking|novel|greatest|state-of-the-art|fundamental|extensive|production|existing|computational)\b/gi,
  adv: /\b(significantly|already|both|during|further)\b/gi,
  prep: /\b(at|in|from|with|by|for|on|to|through|during|before|after|over|under)\b/gi,
  det: /\b(the|a|an|this|that|these|those|its|their)\b/gi
};

const sentimentWords = {
  positive: ['groundbreaking', 'novel', 'significant', 'outstanding', 'state-of-the-art', 'fundamental', 'interest', 'greatest', 'extensive'],
  negative: ['costs', 'reducing', 'existing']
};

function analyzeText(text) {
  // Tokenize
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

  // Word frequency
  const freq = {};
  words.forEach(w => {
    const lower = w.toLowerCase().replace(/[^a-z]/g, '');
    if (lower.length > 2 && !stopWords.has(lower)) {
      freq[lower] = (freq[lower] || 0) + 1;
    }
  });

  const keywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([word, count]) => ({ word, count }));

  // Sentiment
  let posScore = 0, negScore = 0;
  const lower = text.toLowerCase();
  sentimentWords.positive.forEach(w => {
    const matches = (lower.match(new RegExp(w, 'gi')) || []).length;
    posScore += matches * 0.15;
  });
  sentimentWords.negative.forEach(w => {
    const matches = (lower.match(new RegExp(w, 'gi')) || []).length;
    negScore += matches * 0.1;
  });
  const sentimentScore = Math.max(-1, Math.min(1, posScore - negScore));

  // POS tagging (simplified)
  const posTags = [];
  words.forEach(w => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, '');
    let tag = 'other';
    for (const [t, pattern] of Object.entries(posPatterns)) {
      if (pattern.test(clean)) { tag = t; break; }
    }
    if (tag === 'other') {
      if (/ing$/.test(clean)) tag = 'verb';
      else if (/tion$|ment$|ness$|ity$/.test(clean)) tag = 'noun';
      else if (/ly$/.test(clean)) tag = 'adv';
      else if (/ous$|ive$|ful$|less$|able$/.test(clean)) tag = 'adj';
    }
    posTags.push({ word: w, tag });
  });

  // Entities
  const entities = {
    person: personNames.filter(n => text.includes(n)),
    organization: orgNames.filter(n => text.includes(n)),
    location: locationNames.filter(n => text.includes(n)),
    date: dateExpressions.filter(n => text.includes(n))
  };

  // Highlight text
  let highlighted = text;
  [...entities.person].sort((a, b) => b.length - a.length).forEach(e => {
    highlighted = highlighted.replace(new RegExp(e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `<span class="hl-person">${e}</span>`);
  });
  [...entities.organization].sort((a, b) => b.length - a.length).forEach(e => {
    highlighted = highlighted.replace(new RegExp(e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `<span class="hl-org">${e}</span>`);
  });
  [...entities.location].sort((a, b) => b.length - a.length).forEach(e => {
    highlighted = highlighted.replace(new RegExp(e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `<span class="hl-location">${e}</span>`);
  });
  [...entities.date].sort((a, b) => b.length - a.length).forEach(e => {
    highlighted = highlighted.replace(new RegExp(e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `<span class="hl-date">${e}</span>`);
  });

  // Readability
  const syllables = words.reduce((s, w) => s + Math.max(1, w.replace(/[^aeiou]/gi, '').length), 0);
  const flesch = Math.round(206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (syllables / words.length));

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    charCount: text.length,
    keywords,
    sentimentScore,
    posTags,
    entities,
    highlighted,
    readability: Math.max(0, Math.min(100, flesch)),
    avgWordLength: (words.reduce((s, w) => s + w.length, 0) / words.length).toFixed(1)
  };
}

function renderResults(result) {
  // Stats
  document.getElementById('wordCount').textContent = result.wordCount;
  document.getElementById('sentenceCount').textContent = result.sentenceCount;
  document.getElementById('charCount').textContent = result.charCount;
  document.getElementById('readability').textContent = result.readability;
  document.getElementById('avgWordLen').textContent = result.avgWordLength;

  // Sentiment
  const score = result.sentimentScore;
  const pct = ((score + 1) / 2) * 100;
  document.getElementById('sentimentNeedle').style.left = `calc(${pct}% - 10px)`;
  document.getElementById('sentimentValue').textContent = score.toFixed(3);
  document.getElementById('sentimentValue').style.color = score > 0.1 ? '#22c55e' : score < -0.1 ? '#dc2626' : '#d97706';

  let sentimentLabel = 'Neutral';
  if (score > 0.3) sentimentLabel = 'Very Positive';
  else if (score > 0.1) sentimentLabel = 'Positive';
  else if (score < -0.3) sentimentLabel = 'Very Negative';
  else if (score < -0.1) sentimentLabel = 'Negative';
  document.getElementById('sentimentText').textContent = sentimentLabel;

  // Highlighted text
  document.getElementById('highlightedText').innerHTML = result.highlighted;

  // Entities
  const entContainer = document.getElementById('entityChips');
  entContainer.innerHTML = '';
  Object.entries(result.entities).forEach(([type, items]) => {
    items.forEach(item => {
      const chip = document.createElement('span');
      const cls = type === 'person' ? 'hl-person' : type === 'organization' ? 'hl-org' : type === 'location' ? 'hl-location' : 'hl-date';
      chip.className = cls;
      chip.style.margin = '3px';
      chip.style.padding = '2px 8px';
      chip.style.borderRadius = '4px';
      chip.style.fontSize = '0.85rem';
      chip.style.fontFamily = 'Inter, sans-serif';
      chip.textContent = `${type}: ${item}`;
      entContainer.appendChild(chip);
    });
  });

  // POS tags
  const posGrid = document.getElementById('posGrid');
  posGrid.innerHTML = '';
  const tagDisplay = result.posTags.slice(0, 60);
  tagDisplay.forEach(pt => {
    const span = document.createElement('span');
    span.className = `pos-tag pos-${pt.tag}`;
    span.innerHTML = `<span class="word">${pt.word}</span><span class="tag">${pt.tag}</span>`;
    posGrid.appendChild(span);
  });

  // Keywords
  const kwContainer = document.getElementById('keywordList');
  kwContainer.innerHTML = '';
  result.keywords.forEach((kw, i) => {
    const chip = document.createElement('span');
    chip.className = `keyword-chip k${(i % 4) + 1}`;
    chip.innerHTML = `${kw.word}<span class="keyword-freq">(${kw.count})</span>`;
    kwContainer.appendChild(chip);
  });
}

function animatePipeline() {
  const stages = document.querySelectorAll('.pipe-stage');
  stages.forEach(s => s.classList.remove('active'));
  let i = 0;
  const interval = setInterval(() => {
    if (i < stages.length) {
      stages.forEach((s, j) => {
        if (j < i) s.classList.add('active');
      });
      i++;
    } else {
      clearInterval(interval);
      stages.forEach(s => s.classList.add('active'));
    }
  }, 200);
}

function analyze() {
  const text = document.getElementById('textInput').value;
  if (!text.trim()) return;

  animatePipeline();

  setTimeout(() => {
    const result = analyzeText(text);
    renderResults(result);
    state.analyzed = true;
  }, 1000);
}

// Init
document.getElementById('textInput').value = sampleText;
document.getElementById('btnAnalyze').addEventListener('click', analyze);
document.getElementById('btnSample').addEventListener('click', () => {
  document.getElementById('textInput').value = sampleText;
  analyze();
});
