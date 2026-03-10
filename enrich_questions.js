/**
 * Enrichment Script for Interview Questions
 *
 * Reads questions.json, applies enriched answers from batch files,
 * and writes the updated JSON back. Validates JSON integrity after update.
 *
 * Usage: node enrich_questions.js
 */

const fs = require('fs');
const path = require('path');

const QUESTIONS_FILE = path.join(__dirname, 'questions.json');
const BATCHES_DIR = path.join(__dirname, 'enrichment-batches');

function loadQuestions() {
  const raw = fs.readFileSync(QUESTIONS_FILE, 'utf-8');
  return JSON.parse(raw);
}

function loadBatches() {
  if (!fs.existsSync(BATCHES_DIR)) {
    console.log('No enrichment-batches directory found.');
    return [];
  }
  const files = fs.readdirSync(BATCHES_DIR)
    .filter(f => f.endsWith('.json'))
    .sort();

  const allUpdates = [];
  for (const file of files) {
    const filePath = path.join(BATCHES_DIR, file);
    const batch = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`Loaded batch: ${file} (${batch.length} updates)`);
    allUpdates.push(...batch);
  }
  return allUpdates;
}

function applyUpdates(data, updates) {
  const questionsMap = new Map();
  data.questions.forEach(q => questionsMap.set(q.id, q));

  let applied = 0;
  let skipped = 0;
  let added = 0;

  for (const update of updates) {
    // New question entries (e.g., project explanations) have string IDs
    if (typeof update.id === 'string' && update.category) {
      // Check if already added
      const existing = data.questions.find(q => q.id === update.id);
      if (!existing) {
        data.questions.push(update);
        added++;
      }
      continue;
    }

    const q = questionsMap.get(update.id);
    if (!q) {
      console.warn(`  WARNING: Question ID ${update.id} not found, skipping.`);
      skipped++;
      continue;
    }
    q.answer = update.answer;
    applied++;
  }

  console.log(`\nApplied ${applied} answer updates, skipped ${skipped}, added ${added} new entries.`);
  return data;
}

function validate(data) {
  // Check JSON is serializable
  const serialized = JSON.stringify(data);
  const parsed = JSON.parse(serialized);

  // Check all questions have non-empty answers
  let emptyAnswers = 0;
  for (const q of parsed.questions) {
    if (!q.answer || q.answer.trim().length === 0) {
      emptyAnswers++;
    }
  }

  console.log(`\nValidation:`);
  console.log(`  Total questions: ${parsed.questions.length}`);
  console.log(`  Questions with empty answers: ${emptyAnswers}`);
  console.log(`  JSON valid: YES`);

  return true;
}

function main() {
  console.log('=== Interview Questions Enrichment ===\n');

  const data = loadQuestions();
  console.log(`Loaded ${data.questions.length} questions.\n`);

  const updates = loadBatches();
  if (updates.length === 0) {
    console.log('No updates to apply.');
    return;
  }

  const updated = applyUpdates(data, updates);

  if (validate(updated)) {
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    console.log('\nquestions.json updated successfully!');
  } else {
    console.error('\nValidation failed. No changes written.');
    process.exit(1);
  }
}

main();
