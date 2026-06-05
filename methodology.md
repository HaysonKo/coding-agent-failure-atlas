# Methodology

This document describes how runs are designed, what evidence is collected, and
how outcomes are reviewed and scored. The process favors small tasks, consistent
evidence, and explicit human judgment over automation.

## Task design

Tasks are kept small and self-contained so that a single run can be reviewed end
to end. Good tasks for this atlas:

- Have a clear, verifiable goal (a bug fix, a small feature, a refactor).
- Touch a bounded slice of a codebase rather than the whole project.
- Have an unambiguous notion of "done" (often expressed as tests).
- Can plausibly be completed in a single agent session.

Each task records the starting repository state and the exact prompt given to
the agent, so the run can be understood without external context.

## Evidence collected

For every run we capture the same evidence set:

- The **task prompt** as given.
- The **repo/context** the agent started from.
- The **expected behavior** a competent contributor would produce.
- A **transcript summary** of the agent's actions.
- The **files changed** and a **diff summary**.
- The **test output** before and after the change where relevant.
- A **human judgment** of the result.
- A **failure class**, **severity**, and **decision**.

## Transcript review

The transcript summary condenses the agent's session into the decisions that
mattered: how it investigated the repo, what plan it formed, where it changed
course, and how it responded to errors or test failures. The aim is to capture
reasoning quality and recovery behavior, not to transcribe every token.

## Diff review

The diff review looks at what actually changed in the code, independent of what
the agent said it did. We note scope (did it stay within the task?), quality
(is the change idiomatic and readable?), and any collateral edits that were not
required by the task.

## Test-output review

Where tests exist, we record their output and whether the change made them pass,
left them failing, or introduced new failures. When tests are absent, we note
how the change was otherwise validated and whether that validation was adequate.

## Human judgment

A reviewer assigns the final outcome — success, partial, or failure — based on
all the evidence above. Human judgment is the authority here: automated signals
inform it but do not override it. The reviewer records a short rationale so the
call can be understood and revisited later.

## Failure classification

When a run is not a clean success, it is tagged with one or more failure classes
from `findings/failure-taxonomy.md`. A run may carry multiple tags when several
issues compound. Classification is descriptive, not punitive — the goal is to
build a shared vocabulary for recurring behaviors.

## Launch-readiness style scoring

Each run is scored on a 1–5 rubric (see `templates/scoring-rubric.md`) across
several dimensions: task completion, correctness, test behavior, recovery, tool
use, edit quality, and regression risk. These scores are a structured way to
compare runs qualitatively; they are deliberately coarse and are not aggregated
into a single headline number.
