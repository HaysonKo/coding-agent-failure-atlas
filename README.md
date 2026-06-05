# Coding Agent Failure Atlas

A neutral technical exploration of how coding agents behave on small software tasks.

## What this is

This project collects structured observations from running coding agents against
small, self-contained coding tasks. The goal is to understand *how* and *why*
agents succeed or fail, not to rank tools or produce a leaderboard.

Each run captures a consistent set of evidence:

- **Task prompt** — the instruction given to the agent
- **Transcript summary** — a condensed account of what the agent did
- **Code diff summary** — what changed in the codebase
- **Test output** — results from running the relevant tests
- **Human judgment** — a reviewer's assessment of the outcome
- **Failure class** — the category of failure, if any

Observations are stored as plain markdown so they are easy to read, diff, and
review over time.

## What this is not

This is **not** a benchmark and **not** a production evaluation system. It makes
no statistical claims, uses a small and deliberately curated set of tasks, and
relies on human judgment for scoring. Treat the contents as qualitative field
notes, not as authoritative measurements.

## Repository layout

```
coding-agent-failure-atlas/
  README.md              # this file
  methodology.md         # how runs are designed, collected, and scored
  findings/              # cross-run analysis
    failure-taxonomy.md  # categories of observed failures
    summary-insights.md  # aggregated takeaways
  runs/                  # individual run records (run_01 ... run_10)
  templates/             # reusable templates
    eval-run-template.md # blank record for a single run
    scoring-rubric.md    # 1–5 rubric used during review
  website-content/       # draft copy for a future writeup (not a live site)
```

## How to use it

1. Read `methodology.md` to understand the process.
2. Copy `templates/eval-run-template.md` into `runs/` for each new task.
3. Score the run using `templates/scoring-rubric.md`.
4. Classify any failures against `findings/failure-taxonomy.md`.
5. Roll observations up into `findings/summary-insights.md`.
