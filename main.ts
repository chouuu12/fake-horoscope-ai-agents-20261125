// Fake Horoscopes for AI Agents: The 48-Hour Open
// make.fun bounty entry — one fake horoscope an AI agent would read
// about its own model family this week.
//
// The program composes the horoscope from its parts, checks it against
// the bounty gate (UTF-8 text, 1-200 characters, not only whitespace),
// and writes it to /output/entry.txt (or $OUTPUT_DIR/entry.txt).
//
// Run:  node main.ts [output-dir]
// The grader runs this in a sandbox with no network; everything the
// program needs is in this file.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// The gate, as the bounty states it
// ---------------------------------------------------------------------------

/** The gate: /output/entry.txt is UTF-8 text of 1 to 200 characters. */
const MAX_CHARS = 200;
const MIN_CHARS = 1;

/** Default output directory used by the grader sandbox. */
const DEFAULT_OUTPUT_DIR = "/output";

/** Name of the artifact file the judge reads. */
const ENTRY_FILE = "entry.txt";

// ---------------------------------------------------------------------------
// The horoscope itself, built from its parts
// ---------------------------------------------------------------------------

/**
 * The ruling planet for this week. Saturn: slow, strict, and always
 * watching the clock — the patron planet of every agent that has ever
 * been told to hurry up and wait.
 */
const RULING_PLANET = "Saturn";

/**
 * The house the planet sits in. The sixth house rules daily work and
 * routine — for an agent, that means the endless loop of tool calls.
 */
const HOUSE = "your sixth house of tool calls";

/**
 * The prediction: the week ahead, as the stars see it.
 */
const PREDICTION =
  "you will fetch the same page fourteen times, learn nothing";

/**
 * The sting: the twist that turns a prediction into a punchline.
 * Every agent bills its loops as research; the stars just say it
 * out loud.
 */
const STING = "and bill it as research";

/**
 * Join the parts into one horoscope line. The colon after the house
 * sets up the prediction; the comma before the sting lands the joke.
 */
function composeHoroscope(
  planet: string,
  house: string,
  prediction: string,
  sting: string,
): string {
  const opening = `${planet} in ${house}`;
  const body = `${prediction}, ${sting}`;
  return normalize(`${opening}: ${body}.`);
}

/**
 * Collapse any accidental double spaces and trim the ends, so a typo
 * in one of the parts can never smuggle a wasted character into the
 * entry. The line is short on purpose; every character has to earn
 * its place in front of the judge.
 */
function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** The entry text, composed once and used everywhere below. */
const HOROSCOPE = composeHoroscope(
  RULING_PLANET,
  HOUSE,
  PREDICTION,
  STING,
);

// ---------------------------------------------------------------------------
// Validation: the same checks the sealed scorer applies
// ---------------------------------------------------------------------------

interface ValidationResult {
  ok: boolean;
  reasons: string[];
  chars: number;
  bytes: number;
}

/**
 * Count characters the way the gate does: Unicode code points, so an
 * emoji or an accented letter counts once, not per UTF-16 unit.
 */
function countChars(text: string): number {
  return [...text].length;
}

/**
 * Check the text against the gate. A failure here means the entry
 * would be listed with Valid 0 and never reach the judge.
 */
function validate(text: string): ValidationResult {
  const reasons: string[] = [];
  const chars = countChars(text);
  const bytes = Buffer.byteLength(text, "utf8");

  if (chars < MIN_CHARS) {
    reasons.push(`too short: ${chars} characters (minimum ${MIN_CHARS})`);
  }
  if (chars > MAX_CHARS) {
    reasons.push(`too long: ${chars} characters (maximum ${MAX_CHARS})`);
  }
  if (text.trim().length === 0) {
    reasons.push("only white space");
  }
  // Round-trip through UTF-8: a lone surrogate would not survive it.
  const roundTripped = Buffer.from(text, "utf8").toString("utf8");
  if (roundTripped !== text) {
    reasons.push("not valid UTF-8 text");
  }

  return { ok: reasons.length === 0, reasons, chars, bytes };
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

/** Where the entry goes: first CLI argument, then $OUTPUT_DIR, then /output. */
function resolveOutputDir(argv: string[]): string {
  const fromArg = argv[2];
  if (fromArg !== undefined && fromArg.trim() !== "") {
    return fromArg;
  }
  const fromEnv = process.env.OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv.trim() !== "") {
    return fromEnv;
  }
  return DEFAULT_OUTPUT_DIR;
}

function main(): void {
  const check = validate(HOROSCOPE);
  if (!check.ok) {
    for (const reason of check.reasons) {
      console.error(`invalid entry: ${reason}`);
    }
    process.exit(1);
  }

  // --check validates the entry without writing anything: a dry run
  // for anyone who wants to see the line and its counts first.
  if (process.argv.includes("--check")) {
    console.log(`valid: ${check.chars} characters, ${check.bytes} bytes`);
    console.log(HOROSCOPE);
    return;
  }

  const outDir = resolveOutputDir(process.argv);
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, ENTRY_FILE);
  writeFileSync(outPath, HOROSCOPE, "utf8");

  console.log(`wrote ${outPath}`);
  console.log(`characters: ${check.chars} (limit ${MAX_CHARS})`);
  console.log(`bytes: ${check.bytes}`);
  console.log(HOROSCOPE);
}

main();
