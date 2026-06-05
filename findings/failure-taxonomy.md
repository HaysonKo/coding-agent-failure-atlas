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
- *Examples:* _(to be filled in from runs)_
