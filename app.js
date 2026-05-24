/**
 * NLPipeline Agent — Rule-based NLP Text Processor
 * =================================================
 * Tokenize → POS Tag → NER → Sentiment → Summary
 * No external dependencies — all processing in vanilla JS.
 */

// ============================================
// LEXICON & DICTIONARY DATA
// ============================================

/** Common English words mapped to POS tags */
const POS_LEXICON = {
  // Determiners / Articles
  DET: ['the','a','an','this','that','these','those','my','your','his','her','its','our','their','some','any','no','every','each','all','both','few','many','much','more','most','either','neither'],
  // Prepositions
  PREP: ['in','on','at','to','for','of','with','by','from','up','about','into','through','during','before','after','above','below','between','under','over','against','along','across','behind','beyond','around','near','among','throughout','within','without','upon','toward','towards','among','beside','besides','beneath','beneath','despite','except','inside','outside','until','since','except','per','via','plus'],
  // Pronouns
  PRON: ['i','me','we','us','you','he','him','she','her','it','they','them','myself','yourself','himself','herself','itself','ourselves','themselves','who','whom','whose','which','what','that','this','these','those','someone','anyone','everyone','nobody','somebody','everybody','anything','everything','nothing','something'],
  // Common verbs (base form for matching)
  VERB: ['is','are','was','were','be','been','being','have','has','had','having','do','does','did','will','would','shall','should','can','could','may','might','must','need','ought','go','goes','went','gone','going','get','gets','got','getting','make','makes','made','making','take','takes','took','taken','taking','come','comes','came','coming','say','says','said','saying','see','sees','saw','seen','seeing','know','knows','knew','known','knowing','think','thinks','thought','thinking','give','gives','gave','given','giving','find','finds','found','finding','tell','tells','told','telling','ask','asks','asked','asking','work','works','worked','working','seem','seems','seemed','seeming','feel','feels','felt','feeling','try','tries','tried','trying','leave','leaves','left','leaving','call','calls','called','calling','keep','keeps','kept','keeping','let','lets','begin','begins','began','begun','beginning','show','shows','showed','shown','showing','hear','hears','heard','hearing','play','plays','played','playing','run','runs','ran','running','move','moves','moved','moving','live','lives','lived','living','believe','believes','believed','believing','bring','brings','brought','bringing','happen','happens','happened','happening','write','writes','wrote','written','writing','provide','provides','provided','providing','sit','sits','sat','sitting','stand','stands','stood','standing','lose','loses','lost','losing','pay','pays','paid','paying','meet','meets','met','meeting','include','includes','included','including','continue','continues','continued','continuing','set','sets','learn','learns','learned','learning','change','changes','changed','changing','lead','leads','led','leading','understand','understands','understood','understanding','watch','watches','watched','watching','follow','follows','followed','following','stop','stops','stopped','stopping','create','creates','created','creating','speak','speaks','spoke','spoken','speaking','read','reads','reading','allow','allows','allowed','allowing','add','adds','added','adding','spend','spends','spent','spending','grow','grows','grew','grown','growing','open','opens','opened','opening','walk','walks','walked','walking','win','wins','won','winning','offer','offers','offered','offering','remember','remembers','remembered','remembering','consider','considers','considered','considering','appear','appears','appeared','appearing','buy','buys','bought','buying','wait','waits','waited','waiting','serve','serves','served','serving','die','dies','died','dying','send','sends','sent','sending','expect','expects','expected','expecting','build','builds','built','building','stay','stays','stayed','staying','fall','falls','fell','fallen','falling','cut','cuts','reach','reaches','reached','reaching','kill','kills','killed','killing','remain','remains','remained','remaining','suggest','suggests','suggested','suggesting','raise','raises','raised','raising','pass','passes','passed','passing','sell','sells','sold','selling','require','requires','required','requiring','report','reports','reported','reporting','decide','decides','decided','deciding','pull','pulls','pulled','pulling','develop','develops','developed','developing','eat','eats','ate','eaten','eating','drink','drinks','drank','drunk','drinking','love','loves','loved','loving','hate','hates','hated','hating','enjoy','enjoys','enjoyed','enjoying','like','likes','liked','liking'],
  // Common adjectives
  ADJ: ['good','great','new','old','big','small','long','short','high','low','young','early','last','little','only','other','right','big','large','full','important','different','small','large','possible','main','last','public','bad','same','able','beautiful','better','best','black','blue','brown','clear','close','cold','common','dark','different','easy','effective','entire','even','excellent','every','familiar','final','fine','first','foreign','free','full','happy','hard','healthy','high','hot','huge','important','interesting','known','large','last','late','left','less','likely','little','long','low','main','major','military','missing','modern','much','narrow','natural','negative','nice','normal','number','old','open','original','other','own','particular','past','personal','physical','political','popular','positive','possible','powerful','present','private','professional','public','pure','real','recent','red','religious','respect','right','rising','rough','serious','several','significant','similar','simple','single','small','social','solid','specific','strong','such','sudden','sure','sweet','tall','technical','true','typical','unable','unique','unlikely','upper','urban','usual','various','violent','visual','weak','western','white','whole','wide','wild','willing','wise','wonderful','wrong','young','excited','amazing','groundbreaking','fantastic','brilliant','awesome','terrible','awful','horrible','delightful','gorgeous','incredible','remarkable','outstanding','impressive','magnificent','stunning'],
  // Common adverbs
  ADV: ['very','really','quite','just','also','still','already','even','always','never','often','sometimes','now','then','here','there','only','too','enough','almost','perhaps','certainly','probably','actually','obviously','clearly','simply','nearly','entirely','completely','recently','suddenly','quickly','slowly','carefully','easily','hardly','merely','further','together','instead','otherwise','meanwhile','however','nevertheless','fortunately','unfortunately','obviously','apparently','honestly','definitely','absolutely','basically','essentially','principally','mainly','largely','highly','extremely','incredibly','remarkably','totally','utterly'],
  // Conjunctions
  CONJ: ['and','but','or','nor','yet','so','because','although','though','while','whereas','if','unless','until','since','after','before','when','whenever','where','wherever','whether','as','once','provided','providing'],
};

/** Negative sentiment words */
const NEGATIVE_WORDS = ['bad','terrible','awful','horrible','hate','angry','sad','unhappy','disappointed','poor','worst','worried','anxious','fear','scary','ugly','wrong','fail','failed','failure','problem','difficult','hard','pain','hurt','suffer','loss','lost','negative','unfortunately','sadly','misery','disaster','tragic','annoying','boring','dull','bland','weak','broken','damage','destroy','ruin','decline','crisis','threat','danger','risk','worse','declining','struggling','troubled'];

/** Positive sentiment words */
const POSITIVE_WORDS = ['good','great','excellent','amazing','wonderful','fantastic','awesome','love','happy','joy','beautiful','brilliant','perfect','best','better','success','successful','triumph','win','winning','enjoy','enjoyed','delightful','gorgeous','incredible','remarkable','outstanding','impressive','magnificent','stunning','pleased','excited','exciting','thrilled','grateful','thankful','proud','inspire','inspired','inspiring','accomplish','achieve','achievement','progress','improve','improved','improvement','positive','optimistic','hope','hopeful','cheerful','bright','radiant','splendid','superb','marvelous','phenomenal','extraordinary','brilliant','genius','innovative','revolutionary','groundbreaking','creative','effective','powerful','strong','robust','vibrant','healthy','safe','secure','stable','reliable','trustworthy','friendly','kind','generous','gentle','calm','peaceful','serene','relax','fun','entertainment','celebrate','celebration','gift','reward','benefit','advantage','prosperous','flourish','thrive','bloom'];

/** Intensifiers / modifiers */
const INTENSIFIERS = ['very','really','quite','extremely','incredibly','absolutely','totally','utterly','completely','highly','remarkably','exceptionally','tremendously','deeply','highly','enormously','immensely','seriously','truly','particularly','especially','remarkably'];

/** Negators */
const NEGATORS = ['not','no','never','neither','nor','hardly','barely','scarcely','seldom','rarely'];

/** Known person name patterns (first/last) */
const COMMON_FIRST_NAMES = [
  'sarah','james','john','michael','david','robert','jennifer','elizabeth','linda','maria',
  'patricia','barbara','susan','jessica','linda','karen','nancy','betty','margaret','sandra',
  'ashley','emily','donna','michelle','carol','amanda','melissa','deborah','stephanie',
  'rebecca','sharon','laura','cynthia','kathleen','amy','angela','shirley','anna','brenda',
  'pamela','emma','nicole','helen','samantha','katherine','christine','debra','rachel',
  'carolyn','janet','catherine','maria','heather','diane','ruth','julie','olivia','joyce',
  'virginia','victoria','kelly','lauren','christina','joan','evelyn','judith','megan',
  'andrea','cheryl','hannah','jacqueline','martha','gloria','teresa','ann','sara','madison',
  'frances','kathryn','janice','jean','abigail','alice','judy','sophia','grace','denise',
  'alexander','william','richard','thomas','charles','christopher','daniel','matthew','anthony',
  'mark','paul','steven','andrew','joshua','kevin','brian','george','edward','ronald',
  'timothy','jason','jeffrey','ryan','jacob','gary','nicholas','eric','stephen','jonathan',
  'larry','justin','scott','brandon','benjamin','samuel','raymond','gregory','frank','alex',
  'patrick','jack','dennis','jerry','tyler','aaron','jose','adam','nathan','henry',
  'peter','zachary','douglas','harold','carl','arthur','gerald','roger','keith','jeremy',
  'terry','lawrence','sean','albert','joe','christian','austin','willie','billy','bruce',
  'ralph','roy','eugene','russell','bobby','mason','philip','harry','dylan','noah',
  'liam','logan','mason','logan','ethan','lucas','alexander','matthew','jackson',
];

/** Known organizations */
const KNOWN_ORGANIZATIONS = [
  'google','microsoft','apple','amazon','facebook','meta','netflix','tesla','spacex',
  'nasa','who','un','eu','nato','ibm','intel','oracle','cisco','adobe','salesforce',
  'uber','lyft','airbnb','spotify','twitter','linkedin','reddit','tiktok','snapchat',
  'samsung','sony','toyota','bmw','mercedes','volkswagen','honda','ford','chevrolet',
  'boeing','lockheed','raytheon','coca-cola','pepsi','mcdonalds','starbucks','nike',
  'adidas','visa','mastercard','jpmorgan','goldman','sachs','citigroup','barclays',
  'university','institute','foundation','corporation','company','laboratory','research',
  'bank','hospital','council','agency','bureau','department','ministry','commission',
  'microsoft research','openai','anthropic','deepmind','ibm research',
];

/** Known locations */
const KNOWN_LOCATIONS = [
  'new york','los angeles','san francisco','chicago','houston','phoenix','philadelphia',
  'san antonio','san diego','dallas','san jose','austin','jacksonville','fort worth',
  'columbus','charlotte','indianapolis','san francisco','seattle','denver','washington',
  'boston','nashville','portland','las vegas','miami','atlanta','detroit','minneapolis',
  'london','paris','tokyo','berlin','madrid','rome','vienna','prague','amsterdam',
  'brussels','zurich','geneva','stockholm','oslo','copenhagen','helsinki','dublin',
  'moscow','istanbul','beijing','shanghai','hong kong','singapore','sydney','melbourne',
  'toronto','vancouver','mumbai','delhi','bangkok','seoul','taipei','dubai',
  'united states','united kingdom','europe','asia','africa','australia','canada',
  'china','japan','india','germany','france','italy','spain','brazil','mexico',
];

/** Title prefixes for person detection */
const TITLE_PREFIXES = ['dr.','dr','prof.','prof','mr.','mr','mrs.','mrs','ms.','ms','sir','madam','president','director','ceo','cto','cfo','vp','minister','governor','senator','mayor','king','queen','prince','princess','lord','lady'];


// ============================================
// CORE NLP PROCESSORS
// ============================================

/**
 * STAGE 1: Tokenizer
 * Splits text into words with character positions.
 */
function tokenize(text) {
  const tokens = [];
  const regex = /([A-Za-z0-9]+(?:['-][A-Za-z0-9]+)*(?:\.[A-Za-z0-9]+)*)|([^\s])/g;
  let match;
  let index = 0;

  while ((match = regex.exec(text)) !== null) {
    const token = {
      text: match[0],
      start: match.index,
      end: match.index + match[0].length,
      index: index++,
      isWord: /^[A-Za-z]/.test(match[0]),
    };
    tokens.push(token);
  }

  // Group consecutive punctuation into sentence-level tokens
  const sentences = [];
  let currentSentence = [];
  for (const token of tokens) {
    currentSentence.push(token);
    if (token.text === '.' || token.text === '!' || token.text === '?') {
      sentences.push([...currentSentence]);
      currentSentence = [];
    }
  }
  if (currentSentence.length > 0) {
    sentences.push(currentSentence);
  }

  return { tokens, sentences, totalTokens: tokens.length, wordCount: tokens.filter(t => t.isWord).length };
}

/**
 * STAGE 2: Part-of-Speech Tagger (Rule-based)
 * Tags each word token with a POS category.
 */
function posTag(tokenResult) {
  const tagged = tokenResult.tokens.map(token => {
    if (!token.isWord) {
      return { ...token, pos: 'PUNCT', posLabel: 'Punctuation' };
    }

    const lower = token.text.toLowerCase();
    const noPeriod = lower.replace(/\.$/, '');

    // Check lexicon categories
    if (POS_LEXICON.DET.includes(noPeriod) || POS_LEXICON.DET.includes(lower)) {
      return { ...token, pos: 'DET', posLabel: 'Determiner' };
    }
    if (POS_LEXICON.PREP.includes(noPeriod) || POS_LEXICON.PREP.includes(lower)) {
      return { ...token, pos: 'PREP', posLabel: 'Preposition' };
    }
    if (POS_LEXICON.PRON.includes(noPeriod) || POS_LEXICON.PRON.includes(lower)) {
      return { ...token, pos: 'PRON', posLabel: 'Pronoun' };
    }
    if (POS_LEXICON.CONJ.includes(noPeriod) || POS_LEXICON.CONJ.includes(lower)) {
      return { ...token, pos: 'CONJ', posLabel: 'Conjunction' };
    }
    if (POS_LEXICON.ADV.includes(noPeriod) || POS_LEXICON.ADV.includes(lower)) {
      return { ...token, pos: 'ADV', posLabel: 'Adverb' };
    }
    if (POS_LEXICON.ADJ.includes(noPeriod) || POS_LEXICON.ADJ.includes(lower)) {
      return { ...token, pos: 'ADJ', posLabel: 'Adjective' };
    }
    if (POS_LEXICON.VERB.includes(noPeriod) || POS_LEXICON.VERB.includes(lower)) {
      return { ...token, pos: 'VERB', posLabel: 'Verb' };
    }

    // Heuristic: capitalized non-first-word → likely NOUN (proper noun)
    if (token.text[0] === token.text[0].toUpperCase() && token.text[0] !== token.text[0].toLowerCase()) {
      // Could be proper noun if not at sentence start
      if (token.index > 0) {
        return { ...token, pos: 'NOUN', posLabel: 'Proper Noun' };
      }
    }

    // Heuristic: word ending patterns
    if (/ing$|ed$|ize$|ify$|ise$/.test(lower)) {
      return { ...token, pos: 'VERB', posLabel: 'Verb' };
    }
    if (/tion$|ment$|ness$|ity$|ence$|ance$|er$|or$|ist$/.test(lower)) {
      return { ...token, pos: 'NOUN', posLabel: 'Noun' };
    }
    if (/ly$/.test(lower) && lower.length > 4) {
      return { ...token, pos: 'ADV', posLabel: 'Adverb' };
    }
    if (/ous$|ive$|ful$|less$|able$|ible$|al$|ial$|y$/.test(lower) && lower.length > 3) {
      return { ...token, pos: 'ADJ', posLabel: 'Adjective' };
    }

    // Default: noun
    return { ...token, pos: 'NOUN', posLabel: 'Noun' };
  });

  // Compute POS distribution
  const distribution = {};
  tagged.forEach(t => {
    distribution[t.pos] = (distribution[t.pos] || 0) + 1;
  });

  return { tagged, distribution };
}

/**
 * STAGE 3: Named Entity Recognition (Pattern Matching)
 * Extracts person, organization, and location entities.
 */
function extractEntities(posResult) {
  const entities = [];
  const text = posResult.tagged.map(t => t.text).join(' ');
  const lowerText = text.toLowerCase();

  // Rule 1: Check for title + name patterns (e.g., "Dr. Sarah Johnson")
  for (const token of posResult.tagged) {
    const lower = token.text.toLowerCase().replace(/\.$/, '');
    if (TITLE_PREFIXES.includes(lower)) {
      // Collect following capitalized words as name
      const nameParts = [token.text];
      for (let i = token.index + 1; i < posResult.tagged.length && i < token.index + 5; i++) {
        const next = posResult.tagged[i];
        if (next.isWord && next.text[0] === next.text[0].toUpperCase()) {
          nameParts.push(next.text);
        } else {
          break;
        }
      }
      if (nameParts.length > 1) {
        const name = nameParts.join(' ');
        if (!entities.find(e => e.text === name)) {
          entities.push({ text: name, type: 'PERSON', start: token.start, context: getContext(text, name) });
        }
      }
    }
  }

  // Rule 2: Check for known first names (consecutive capitalized words)
  for (let i = 0; i < posResult.tagged.length; i++) {
    const token = posResult.tagged[i];
    if (token.isWord) {
      const lower = token.text.toLowerCase().replace(/\.$/, '');
      if (COMMON_FIRST_NAMES.includes(lower)) {
        // Look for a following capitalized word (last name)
        let nameParts = [token.text];
        let found = false;
        for (let j = i + 1; j < posResult.tagged.length && j < i + 4; j++) {
          const next = posResult.tagged[j];
          if (next.isWord && next.text[0] === next.text[0].toUpperCase() && !COMMON_FIRST_NAMES.includes(next.text.toLowerCase())) {
            nameParts.push(next.text);
            found = true;
          } else if (next.pos === 'PREP' || next.pos === 'CONJ' || next.pos === 'VERB') {
            break;
          } else {
            break;
          }
        }
        if (found && nameParts.length > 1) {
          const name = nameParts.join(' ');
          if (!entities.find(e => e.text === name)) {
            entities.push({ text: name, type: 'PERSON', start: token.start, context: getContext(text, name) });
          }
        }
      }
    }
  }

  // Rule 3: Known organizations
  for (const org of KNOWN_ORGANIZATIONS) {
    const regex = new RegExp('\\b' + org.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
    let m;
    while ((m = regex.exec(lowerText)) !== null) {
      const orgText = text.substring(m.index, m.index + m[0].length);
      if (!entities.find(e => e.text.toLowerCase() === orgText.toLowerCase())) {
        entities.push({ text: orgText, type: 'ORGANIZATION', start: m.index, context: getContext(text, orgText) });
      }
    }
  }

  // Rule 4: Known locations
  for (const loc of KNOWN_LOCATIONS) {
    const regex = new RegExp('\\b' + loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
    let m;
    while ((m = regex.exec(lowerText)) !== null) {
      const locText = text.substring(m.index, m.index + m[0].length);
      if (!entities.find(e => e.text.toLowerCase() === locText.toLowerCase())) {
        entities.push({ text: locText, type: 'LOCATION', start: m.index, context: getContext(text, locText) });
      }
    }
  }

  // Rule 5: Capitalized multi-word phrases not at sentence start → likely entity
  let i = 0;
  while (i < posResult.tagged.length) {
    const t = posResult.tagged[i];
    if (t.isWord && t.text[0] === t.text[0].toUpperCase() && t.text[0] !== t.text[0].toLowerCase()) {
      // Not at sentence start? (preceded by punctuation or at index > 0)
      const isNotSentenceStart = i > 0 && !posResult.tagged[i-1].isWord;
      if (isNotSentenceStart && !entities.find(e => e.start === t.start)) {
        // Check if it's not already tagged as PERSON/ORG/LOC
        entities.push({ text: t.text, type: 'UNKNOWN', start: t.start, context: getContext(text, t.text) });
      }
    }
    i++;
  }

  // Deduplicate and classify remaining UNKNOWN entities
  const final = entities.filter(e => e.type !== 'UNKNOWN');
  const unknowns = entities.filter(e => e.type === 'UNKNOWN');

  unknowns.forEach(u => {
    const lower = u.text.toLowerCase();
    if (KNOWN_ORGANIZATIONS.some(o => o.includes(lower))) {
      u.type = 'ORGANIZATION';
    } else if (KNOWN_LOCATIONS.some(l => l.includes(lower))) {
      u.type = 'LOCATION';
    } else {
      u.type = 'PERSON'; // Default for capitalized words
    }
    if (!final.find(e => e.text.toLowerCase() === u.text.toLowerCase())) {
      final.push(u);
    }
  });

  return { entities: final };
}

function getContext(text, entity) {
  const idx = text.toLowerCase().indexOf(entity.toLowerCase());
  if (idx === -1) return '';
  const start = Math.max(0, idx - 30);
  const end = Math.min(text.length, idx + entity.length + 30);
  let context = text.substring(start, end);
  if (start > 0) context = '...' + context;
  if (end < text.length) context = context + '...';
  return context;
}

/**
 * STAGE 4: Sentiment Analysis (Keyword-based scoring)
 */
function analyzeSentiment(posResult) {
  const tagged = posResult.tagged;
  let score = 0;
  const positiveFound = [];
  const negativeFound = [];
  const intensifiersFound = [];
  const negationActive = false;

  for (let i = 0; i < tagged.length; i++) {
    const token = tagged[i];
    if (!token.isWord) continue;

    const lower = token.text.toLowerCase().replace(/\.$/, '');

    // Check for negators
    const isNegator = NEGATORS.includes(lower);

    // Check for intensifiers
    const isIntensifier = INTENSIFIERS.includes(lower);

    if (isIntensifier) {
      intensifiersFound.push(token.text);
    }

    // Check positive words
    if (POSITIVE_WORDS.includes(lower)) {
      let wordScore = 1;
      // Check preceding token for negation
      if (i > 0) {
        const prevLower = tagged[i-1].text.toLowerCase().replace(/\.$/, '');
        if (NEGATORS.includes(prevLower)) {
          wordScore = -1;
        }
      }
      // Check preceding token for intensifier
      if (i > 0) {
        const prevLower = tagged[i-1].text.toLowerCase().replace(/\.$/, '');
        if (INTENSIFIERS.includes(prevLower)) {
          wordScore *= 1.5;
        }
      }
      // Check preceding-preceding for both negator and intensifier
      if (i > 1) {
        const prevPrevLower = tagged[i-2].text.toLowerCase().replace(/\.$/, '');
        if (NEGATORS.includes(prevPrevLower)) {
          wordScore = -1;
        }
      }

      score += wordScore;
      if (wordScore > 0) {
        positiveFound.push({ word: token.text, score: wordScore });
      } else {
        negativeFound.push({ word: token.text, score: wordScore });
      }
    }

    // Check negative words
    if (NEGATIVE_WORDS.includes(lower)) {
      let wordScore = -1;
      // Check preceding for intensifier
      if (i > 0) {
        const prevLower = tagged[i-1].text.toLowerCase().replace(/\.$/, '');
        if (INTENSIFIERS.includes(prevLower)) {
          wordScore *= 1.5;
        }
      }
      score += wordScore;
      negativeFound.push({ word: token.text, score: wordScore });
    }
  }

  // Normalize score to -1 to 1 range
  const maxPossible = Math.max(positiveFound.length + negativeFound.length, 1);
  const normalizedScore = Math.max(-1, Math.min(1, score / maxPossible));

  let label;
  if (normalizedScore > 0.15) label = 'Positive';
  else if (normalizedScore < -0.15) label = 'Negative';
  else label = 'Neutral';

  return {
    score: normalizedScore,
    rawScore: score,
    label,
    positiveWords: positiveFound,
    negativeWords: negativeFound,
    intensifiers: intensifiersFound,
  };
}

/**
 * STAGE 5: Extractive Summary
 * Scores sentences and picks top ones.
 */
function extractSummary(tokenResult, posResult, sentimentResult) {
  const sentences = tokenResult.sentences;
  if (sentences.length === 0) return { summary: '', selectedSentences: [] };

  // Score each sentence based on multiple heuristics
  const scored = sentences.map((sentenceTokens, idx) => {
    const text = sentenceTokens.map(t => t.text).join(' ');
    let score = 0;

    // 1. Length preference (medium-length sentences)
    const wordCount = sentenceTokens.filter(t => t.isWord).length;
    if (wordCount >= 5 && wordCount <= 30) score += 2;
    if (wordCount > 30) score += 1;

    // 2. Position in text (first and last sentences tend to be important)
    if (idx === 0) score += 3;
    if (idx === sentences.length - 1 && sentences.length > 1) score += 2;
    if (idx === 1) score += 1; // Second sentence often important

    // 3. Contains named entities
    const hasEntity = sentimentResult && sentimentResult.positiveWords.length > 0;
    // Check if sentence has capitalized words (potential entities)
    const capitalizedWords = sentenceTokens.filter(t => t.isWord && t.text[0] === t.text[0].toUpperCase());
    score += capitalizedWords.length * 0.5;

    // 4. Contains sentiment-bearing words
    const sentimentWords = sentenceTokens.filter(t =>
      POSITIVE_WORDS.includes(t.text.toLowerCase()) || NEGATIVE_WORDS.includes(t.text.toLowerCase())
    );
    score += sentimentWords.length * 1.5;

    // 5. Contains verbs (action sentences are informative)
    const taggedInSentence = posResult.tagged.filter(t =>
      sentenceTokens.some(st => st.start === t.start && st.end === t.end) && t.pos === 'VERB'
    );
    score += taggedInSentence.length * 0.5;

    // 6. Penalize very short sentences
    if (wordCount < 3) score -= 2;

    return { text, score, index: idx, wordCount };
  });

  // Sort by score descending
  const sorted = [...scored].sort((a, b) => b.score - a.score);

  // Select top sentences (but keep original order)
  const topN = Math.max(1, Math.min(Math.ceil(sentences.length * 0.5), 5));
  const selected = sorted.slice(0, topN).sort((a, b) => a.index - b.index);

  const summaryText = selected.map(s => s.text).join(' ');

  return {
    summary: summaryText,
    selectedSentences: selected,
    allSentences: scored,
    topN,
  };
}


// ============================================
// PIPELINE ORCHESTRATION
// ============================================

/**
 * Run the full NLP pipeline with visual feedback.
 */
async function processText() {
  const input = document.getElementById('inputText').value.trim();
  if (!input) {
    alert('Please enter some text to process.');
    return;
  }

  const processBtn = document.getElementById('processBtn');
  processBtn.disabled = true;
  processBtn.textContent = '⏳ Processing...';

  // Show pipeline and results
  document.getElementById('pipelineSection').style.display = 'block';
  document.getElementById('resultsSection').style.display = 'block';

  // Reset all stages
  resetPipeline();

  try {
    // Stage 1: Tokenize
    await activateStage('tokenize');
    const tokenResult = tokenize(input);
    await renderTokenResults(tokenResult);
    await delay(500);

    // Stage 2: POS Tag
    await activateStage('pos');
    const posResult = posTag(tokenResult);
    await renderPOSResults(posResult);
    await delay(500);

    // Stage 3: NER
    await activateStage('ner');
    const nerResult = extractEntities(posResult);
    await renderNERResults(nerResult);
    await delay(500);

    // Stage 4: Sentiment
    await activateStage('sentiment');
    const sentimentResult = analyzeSentiment(posResult);
    await renderSentimentResults(sentimentResult);
    await delay(500);

    // Stage 5: Summary
    await activateStage('summary');
    const summaryResult = extractSummary(tokenResult, posResult, sentimentResult);
    await renderSummaryResults(summaryResult);
    await delay(300);

  } catch (error) {
    console.error('Pipeline error:', error);
  }

  processBtn.disabled = false;
  processBtn.textContent = '▶ Process Text';
}


// ============================================
// PIPELINE VISUALIZATION
// ============================================

function resetPipeline() {
  const stages = ['tokenize', 'pos', 'ner', 'sentiment', 'summary'];
  stages.forEach(stage => {
    const el = document.getElementById('stage-' + stage);
    el.className = 'pipeline-stage';
    el.querySelector('.stage-status').textContent = '⏳ Waiting';
  });

  // Reset result cards
  ['tokens', 'pos', 'ner', 'sentiment', 'summary'].forEach(id => {
    const card = document.getElementById('result-' + id);
    if (card) {
      card.classList.remove('visible');
      card.style.display = 'none';
    }
  });
}

async function activateStage(stageName) {
  // Mark previous stages as done
  const stages = ['tokenize', 'pos', 'ner', 'sentiment', 'summary'];
  const currentIdx = stages.indexOf(stageName);

  stages.forEach((s, i) => {
    const el = document.getElementById('stage-' + s);
    if (i < currentIdx) {
      el.className = 'pipeline-stage done';
      el.querySelector('.stage-status').textContent = '✅ Done';
    } else if (i === currentIdx) {
      el.className = 'pipeline-stage active';
      el.querySelector('.stage-status').textContent = '🔄 Processing...';
    }
  });

  await delay(300);
}

async function completeStage(stageName) {
  const el = document.getElementById('stage-' + stageName);
  el.className = 'pipeline-stage done';
  el.querySelector('.stage-status').textContent = '✅ Done';
}


// ============================================
// RENDER FUNCTIONS
// ============================================

async function renderTokenResults(tokenResult) {
  const card = document.getElementById('result-tokens');
  const stats = document.getElementById('tokenStats');
  const body = document.getElementById('tokensBody');

  stats.innerHTML = `
    <span class="stat-item">Total tokens: <strong>${tokenResult.totalTokens}</strong></span>
    <span class="stat-item">Words: <strong>${tokenResult.wordCount}</strong></span>
    <span class="stat-item">Non-words: <strong>${tokenResult.totalTokens - tokenResult.wordCount}</strong></span>
  `;

  const grid = document.createElement('div');
  grid.className = 'token-grid';

  tokenResult.tokens.forEach(token => {
    const chip = document.createElement('span');
    chip.className = 'token-chip';
    chip.innerHTML = `${escapeHTML(token.text)} <span class="token-pos-label">pos:${token.start}</span>`;
    grid.appendChild(chip);
  });

  body.innerHTML = '';
  body.appendChild(grid);

  card.style.display = 'block';
  await delay(100);
  card.classList.add('visible');
  await completeStage('tokenize');
}

async function renderPOSResults(posResult) {
  const card = document.getElementById('result-pos');
  const stats = document.getElementById('posStats');
  const body = document.getElementById('posBody');

  const dist = posResult.distribution;
  const distEntries = Object.entries(dist).sort((a, b) => b[1] - a[1]);

  stats.innerHTML = distEntries.map(([pos, count]) =>
    `<span class="stat-item">${pos}: <strong>${count}</strong></span>`
  ).join('');

  // Token chips with POS tags
  const grid = document.createElement('div');
  grid.className = 'token-grid';

  posResult.tagged.forEach(token => {
    if (!token.isWord) return;
    const chip = document.createElement('span');
    chip.className = 'token-chip';
    const posClass = 'pos-' + token.pos.toLowerCase();
    chip.innerHTML = `${escapeHTML(token.text)} <span class="token-pos ${posClass}">${token.pos}</span>`;
    grid.appendChild(chip);
  });

  // Bar chart
  const barChart = document.createElement('div');
  barChart.className = 'pos-bar-chart';

  const maxCount = Math.max(...distEntries.map(e => e[1]), 1);
  const posColors = {
    NOUN: 'var(--accent-blue)', VERB: 'var(--accent-green)', ADJ: 'var(--accent-orange)',
    ADV: 'var(--accent-pink)', DET: 'var(--accent-purple)', PREP: 'var(--text-muted)',
    PRON: 'var(--accent-red)', CONJ: 'var(--accent-yellow)', PUNCT: '#555',
  };

  distEntries.forEach(([pos, count]) => {
    const group = document.createElement('div');
    group.className = 'pos-bar-group';
    group.innerHTML = `
      <span class="pos-bar-count">${count}</span>
      <div class="pos-bar" style="height: ${(count / maxCount) * 80}px; background: ${posColors[pos] || '#666'}"></div>
      <span class="pos-bar-label">${pos}</span>
    `;
    barChart.appendChild(group);
  });

  body.innerHTML = '';
  body.appendChild(grid);
  body.appendChild(barChart);

  card.style.display = 'block';
  await delay(100);
  card.classList.add('visible');
  await completeStage('pos');
}

async function renderNERResults(nerResult) {
  const card = document.getElementById('result-ner');
  const stats = document.getElementById('nerStats');
  const body = document.getElementById('nerBody');

  const typeCounts = { PERSON: 0, ORGANIZATION: 0, LOCATION: 0 };
  nerResult.entities.forEach(e => {
    typeCounts[e.type] = (typeCounts[e.type] || 0) + 1;
  });

  stats.innerHTML = `
    <span class="stat-item">Total entities: <strong>${nerResult.entities.length}</strong></span>
    <span class="stat-item">Persons: <strong>${typeCounts.PERSON || 0}</strong></span>
    <span class="stat-item">Organizations: <strong>${typeCounts.ORGANIZATION || 0}</strong></span>
    <span class="stat-item">Locations: <strong>${typeCounts.LOCATION || 0}</strong></span>
  `;

  const list = document.createElement('div');
  list.className = 'entity-list';

  if (nerResult.entities.length === 0) {
    list.innerHTML = '<p style="color: var(--text-muted); padding: 12px;">No named entities detected.</p>';
  } else {
    nerResult.entities.forEach(entity => {
      const typeClass = entity.type.toLowerCase();
      const item = document.createElement('div');
      item.className = `entity-item ${typeClass}`;
      item.innerHTML = `
        <span class="entity-type ${typeClass}">${entity.type}</span>
        <span class="entity-text">${escapeHTML(entity.text)}</span>
        <span class="entity-context">${escapeHTML(entity.context)}</span>
      `;
      list.appendChild(item);
    });
  }

  body.innerHTML = '';
  body.appendChild(list);

  card.style.display = 'block';
  await delay(100);
  card.classList.add('visible');
  await completeStage('ner');
}

async function renderSentimentResults(sentimentResult) {
  const card = document.getElementById('result-sentiment');
  const stats = document.getElementById('sentimentStats');
  const body = document.getElementById('sentimentBody');

  const scorePercent = Math.round((sentimentResult.score + 1) / 2 * 100);
  let gaugeColor, gaugeBorder;
  if (sentimentResult.label === 'Positive') {
    gaugeColor = 'var(--accent-green)';
    gaugeBorder = 'rgba(52, 211, 153, 0.3)';
  } else if (sentimentResult.label === 'Negative') {
    gaugeColor = 'var(--accent-red)';
    gaugeBorder = 'rgba(239, 68, 68, 0.3)';
  } else {
    gaugeColor = 'var(--accent-yellow)';
    gaugeBorder = 'rgba(251, 191, 36, 0.3)';
  }

  stats.innerHTML = `
    <span class="stat-item">Label: <strong>${sentimentResult.label}</strong></span>
    <span class="stat-item">Score: <strong>${sentimentResult.score.toFixed(3)}</strong></span>
    <span class="stat-item">Positive words: <strong>${sentimentResult.positiveWords.length}</strong></span>
    <span class="stat-item">Negative words: <strong>${sentimentResult.negativeWords.length}</strong></span>
    <span class="stat-item">Intensifiers: <strong>${sentimentResult.intensifiers.length}</strong></span>
  `;

  const sentimentEmoji = sentimentResult.label === 'Positive' ? '😊' :
    sentimentResult.label === 'Negative' ? '😞' : '😐';

  let wordSections = '';
  if (sentimentResult.positiveWords.length > 0) {
    wordSections += `
      <div class="sentiment-word-section">
        <h4>✅ Positive Indicators</h4>
        <div class="sentiment-word-list">
          ${sentimentResult.positiveWords.map(w =>
            `<span class="sentiment-word positive">${escapeHTML(w.word)} (${w.score > 0 ? '+' : ''}${w.score.toFixed(1)})</span>`
          ).join('')}
        </div>
      </div>
    `;
  }
  if (sentimentResult.negativeWords.length > 0) {
    wordSections += `
      <div class="sentiment-word-section">
        <h4>❌ Negative Indicators</h4>
        <div class="sentiment-word-list">
          ${sentimentResult.negativeWords.map(w =>
            `<span class="sentiment-word negative">${escapeHTML(w.word)} (${w.score.toFixed(1)})</span>`
          ).join('')}
        </div>
      </div>
    `;
  }
  if (sentimentResult.intensifiers.length > 0) {
    wordSections += `
      <div class="sentiment-word-section">
        <h4>⚡ Intensifiers</h4>
        <div class="sentiment-word-list">
          ${sentimentResult.intensifiers.map(w =>
            `<span class="sentiment-word intensifier">${escapeHTML(w)}</span>`
          ).join('')}
        </div>
      </div>
    `;
  }

  body.innerHTML = `
    <div class="sentiment-gauge">
      <div class="gauge-visual" style="border-color: ${gaugeColor}; background: ${gaugeBorder};">
        <div class="gauge-score" style="color: ${gaugeColor};">${sentimentEmoji}</div>
        <div class="gauge-label" style="color: ${gaugeColor};">${sentimentResult.label}</div>
      </div>
      <div class="sentiment-words">
        ${wordSections || '<p style="color:var(--text-muted);">No significant sentiment indicators found.</p>'}
      </div>
    </div>
  `;

  card.style.display = 'block';
  await delay(100);
  card.classList.add('visible');
  await completeStage('sentiment');
}

async function renderSummaryResults(summaryResult) {
  const card = document.getElementById('result-summary');
  const stats = document.getElementById('summaryStats');
  const body = document.getElementById('summaryBody');

  const allSents = summaryResult.allSentences || [];
  const selected = summaryResult.selectedSentences || [];

  stats.innerHTML = `
    <span class="stat-item">Total sentences: <strong>${allSents.length}</strong></span>
    <span class="stat-item">Selected: <strong>${selected.length}</strong></span>
    <span class="stat-item">Compression: <strong>${allSents.length > 0 ? Math.round((selected.length / allSents.length) * 100) : 0}%</strong></span>
  `;

  // Show all sentences with scores, highlighting selected ones
  const summaryDiv = document.createElement('div');
  summaryDiv.className = 'summary-text';

  allSents.forEach(s => {
    const isSelected = selected.some(sel => sel.index === s.index);
    const sentEl = document.createElement('div');
    sentEl.className = 'summary-sentence' + (isSelected ? ' highlight' : '');
    sentEl.innerHTML = `
      ${isSelected ? '<span class="summary-sentence-score">⭐ Score: ' + s.score.toFixed(1) + '</span>' : ''}
      ${escapeHTML(s.text)}
    `;
    summaryDiv.appendChild(sentEl);
  });

  body.innerHTML = '';
  body.appendChild(summaryDiv);

  // Add the extracted summary below
  if (summaryResult.summary) {
    const extractedSection = document.createElement('div');
    extractedSection.style.marginTop = '16px';
    extractedSection.innerHTML = `
      <h4 style="color:var(--accent-blue); margin-bottom:8px;">📋 Extracted Summary:</h4>
      <p style="padding: 12px 16px; background: var(--bg-input); border-radius: 8px; border-left: 3px solid var(--accent-green);">
        ${escapeHTML(summaryResult.summary)}
      </p>
    `;
    body.appendChild(extractedSection);
  }

  card.style.display = 'block';
  await delay(100);
  card.classList.add('visible');
  await completeStage('summary');
}


// ============================================
// UI HELPERS
// ============================================

function clearAll() {
  document.getElementById('inputText').value = '';
  document.getElementById('pipelineSection').style.display = 'none';
  document.getElementById('resultsSection').style.display = 'none';
  updateCharCount();
}

function loadSample() {
  const samples = [
    "Dr. Sarah Johnson works at Google in New York. She is excited about the amazing progress in artificial intelligence. The team at Microsoft Research in Seattle has released groundbreaking results. This is truly fantastic news that will change everything for the better.",
    "The United Nations held a terrible summit in Geneva. Secretary-General Ban Ki-moon addressed the devastating crisis in Syria. The poor refugees suffered horrible conditions. China and Japan continue to have difficult relations. Despite the sad circumstances, there is hope for a better future.",
    "Apple announced a revolutionary new product at their headquarters in Cupertino. Tim Cook presented the incredible device to a delighted audience. The amazing technology will be available in San Francisco stores next month. This is a wonderful achievement for the innovative company.",
    "John went to the store. He bought some milk. It was cold outside. The weather was bad. He was unhappy about the terrible traffic. He arrived late to work. His boss was angry. The meeting was cancelled.",
    "Professor Albert Einstein developed the theory of relativity while working in Zurich. The brilliant scientist made remarkable contributions to physics. His groundbreaking work at Princeton University changed our understanding of the universe forever. He was deeply passionate and truly inspired millions of people worldwide."
  ];
  const random = samples[Math.floor(Math.random() * samples.length)];
  document.getElementById('inputText').value = random;
  updateCharCount();
}

function updateCharCount() {
  const text = document.getElementById('inputText').value;
  document.getElementById('charCount').textContent = `${text.length} characters`;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('inputText');
  textarea.addEventListener('input', updateCharCount);
  updateCharCount();

  // Keyboard shortcut: Ctrl+Enter to process
  textarea.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      processText();
    }
  });
});
