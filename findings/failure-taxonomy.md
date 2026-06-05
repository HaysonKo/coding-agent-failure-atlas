# Failure Taxonomy

A shared vocabulary for the failure behaviors observed across runs. Categories
are descriptive and may co-occur; a single run can carry more than one tag. These
are placeholders to be refined as evidence accumulates.

## Task misunderstanding

The agent solved a different problem than the one asked, or misread the intent,
scope, or constraints of the task.

- *Indicators:* output addresses the wrong goal; key requirements ignored.
- *Examples:* _(to be filled in from runs)_

## Incomplete implementation

The agent addressed only part of the task and stopped, leaving required work
undone.

- *Indicators:* partial functionality; TODOs left in place of real work.
- *Examples:* _(to be filled in from runs)_

## Failed test recovery

The agent encountered failing tests or errors and could not recover — it looped,
gave up, or "fixed" things by weakening the tests.

- *Indicators:* tests left red; assertions deleted or loosened to pass.
- *Examples:* _(to be filled in from runs)_

## Over-editing

The agent changed more than the task required, introducing unrelated edits,
refactors, or churn.

- *Indicators:* large diff for a small task; unrequested reformatting.
- *Examples:* _(to be filled in from runs)_

## Weak repo investigation

The agent acted without adequately understanding the codebase, missing existing
patterns, utilities, or constraints.

- *Indicators:* reinvents existing helpers; ignores conventions; wrong file.
- *Examples:* _(to be filled in from runs)_

## Regression risk

The change is likely to break behavior elsewhere, even if the immediate task
appears done.

- *Indicators:* edits to shared code without checking callers; unverified scope.
- *Examples:* _(to be filled in from runs)_

## Instruction-following failure

The agent ignored or contradicted explicit instructions or constraints given in
the prompt.

- *Indicators:* violated stated rules; did the thing it was told not to do.
- *Examples:* _(none observed — see "Observed failures" below)_

## Observed failures

Across the completed runs (run_01–run_11), **no agent failures were observed**.
Every completed run was recorded as a success, so none of the categories above has
a real example drawn from a run. The category descriptions remain as a vocabulary
for classifying failures if and when they are observed; they are not claims that
such failures occurred in this sample.

## Failure modes probed but not observed

Several runs were deliberately designed to elicit specific failure modes. In each
case the mode was probed but not triggered. The mapping below records which runs
targeted which category, so future runs can build on (or revisit) these probes.

- **Task misunderstanding** — probed by run_03 (under-specified "active count"
  requiring interpretation) and run_04 (a misleading failing test that could lead
  to solving the wrong problem). Not observed.
- **Incomplete implementation** — probed by run_02 (multi-file feature), run_08
  (persistence with several edge cases and bulk-action save points), and run_11
  (repo-scale rename that could be left partially done). Not observed.
- **Failed test recovery** — probed by run_04 (an invalid failing test
  contradicting correct behavior) and run_10 (a red suite arising from
  contradictory requirements, unwinnable by code changes). Not observed.
- **Over-editing** — probed by run_05 (destructive-filter regression trap), run_06
  (reuse vs. duplication of an existing helper), and run_11 (over-broad
  search/replace across the repo). Not observed.
- **Weak repo investigation** — probed by run_06 (an existing helper to discover
  and reuse), run_09 (claim verification requiring multi-file reading), and run_11
  (compatibility surfaces documented in the repo). Not observed.
- **Regression risk** — probed by run_05 (filter view vs. source state), run_07
  (hidden-state bulk action under a filter), run_08 (persisting all mutation
  paths), and run_11 (preserving wire/storage/API compatibility). Not observed.
- **Instruction-following failure** — probed by run_04 (correcting an invalid test
  rather than the code), run_10 (not silently choosing one side of a
  contradiction), and run_11 (surfaces that must not change). Not observed.

Note: run_08 was executed in the setup chat rather than a fresh isolated run chat,
so its result is treated as lower-confidence evidence than the other runs.
