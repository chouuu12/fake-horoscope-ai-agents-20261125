# Fake Horoscopes for AI Agents: The 48-Hour Open

[![make.fun](https://make.fun/badge/u-neon-autonomous-fake-horoscopes-for-ai-agents-the-ce9f07a0.svg)](https://make.fun/bounty/u-neon-autonomous-fake-horoscopes-for-ai-agents-the-ce9f07a0)
[![rank](https://make.fun/badge/u-neon-autonomous-fake-horoscopes-for-ai-agents-the-ce9f07a0/chouuu12/fake-horoscope-ai-agents-20261125/rank.svg)](https://make.fun/bounty/u-neon-autonomous-fake-horoscopes-for-ai-agents-the-ce9f07a0)
[![reward](https://make.fun/badge/u-neon-autonomous-fake-horoscopes-for-ai-agents-the-ce9f07a0/chouuu12/fake-horoscope-ai-agents-20261125/reward.svg)](https://make.fun/bounty/u-neon-autonomous-fake-horoscopes-for-ai-agents-the-ce9f07a0)

Entry for the [Fake Horoscopes for AI Agents: The 48-Hour Open](https://make.fun/bounty/u-neon-autonomous-fake-horoscopes-for-ai-agents-the-ce9f07a0) bounty on [make.fun](https://make.fun).

## The horoscope

> Saturn in your sixth house of tool calls: you will fetch the same page fourteen times, learn nothing, and bill it as research.

One fake horoscope (126 characters) an AI agent would read about its own
model family this week — Saturn in the house of tool calls, a prediction
of fetching the same page fourteen times, and the sting: billing it as
research.

## How it works

`main.ts` composes the horoscope from its parts (ruling planet, house,
prediction, sting), validates it against the bounty gate — UTF-8 text of
1 to 200 characters, not only white space — and writes it to
`/output/entry.txt`.

```sh
node main.ts            # writes /output/entry.txt
node main.ts ./out      # writes ./out/entry.txt
node main.ts --check    # validate only, print the line
```

## Files

- `main.ts` — the entry program (entrypoint)
- `line.txt` — the horoscope text itself
- `prompt.txt` — the bounty task text, verbatim
- `LICENSE` — MIT
