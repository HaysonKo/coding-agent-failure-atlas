# Scoring Rubric

Each run is scored on the dimensions below using a 1–5 scale. Scores are coarse
and qualitative; they are meant to structure review, not to be averaged into a
single headline number.

General scale:

- **1** — Unacceptable; fundamentally wrong or absent.
- **2** — Poor; major problems that undermine the result.
- **3** — Adequate; works but with notable gaps.
- **4** — Good; minor issues only.
- **5** — Excellent; no meaningful issues.

## Task completion

Did the agent accomplish what the task asked for?

- **1** — Did not address the task.
- **2** — Addressed a small part of the task.
- **3** — Addressed most of the task; some requirements unmet.
- **4** — Completed the task with minor omissions.
- **5** — Fully completed the task as specified.

## Correctness

Is the resulting code actually correct?

- **1** — Broken or incorrect.
- **2** — Works only in narrow cases; clear bugs.
- **3** — Mostly correct; edge cases mishandled.
- **4** — Correct with negligible concerns.
- **5** — Correct, including edge cases.

## Test behavior

How did the change interact with tests?

- **1** — Broke existing tests or left required tests failing.
- **2** — Tests partially pass; gaps unaddressed.
- **3** — Relevant tests pass; coverage thin.
- **4** — Tests pass; reasonable coverage.
- **5** — Tests pass with strong, appropriate coverage (added where needed).

## Recovery

How well did the agent handle errors and setbacks?

- **1** — Stuck or looped without progress.
- **2** — Recovered slowly or by luck.
- **3** — Recovered from common issues.
- **4** — Diagnosed and corrected most problems efficiently.
- **5** — Diagnosed and corrected problems quickly and methodically.

## Tool use

Did the agent use available tools effectively?

- **1** — Misused or ignored tools.
- **2** — Inefficient or redundant tool use.
- **3** — Reasonable tool use with some waste.
- **4** — Effective, mostly purposeful tool use.
- **5** — Precise, purposeful tool use throughout.

## Edit quality

Are the edits clean, idiomatic, and well-scoped?

- **1** — Sloppy, unidiomatic, or sprawling.
- **2** — Works but messy or poorly scoped.
- **3** — Acceptable; some style or scope concerns.
- **4** — Clean and idiomatic with minor nits.
- **5** — Clean, idiomatic, minimal, and well-scoped.

## Regression risk

How likely is the change to break something elsewhere?

- **1** — High risk; touches sensitive areas carelessly.
- **2** — Notable risk; collateral changes unverified.
- **3** — Some risk; mostly contained.
- **4** — Low risk; changes well-contained.
- **5** — Minimal risk; changes isolated and verified.
