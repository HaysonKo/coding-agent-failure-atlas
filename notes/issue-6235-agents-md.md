# Issue #6235 — Support AGENTS.md: Technical Note

**Status:** Investigation-only. No implementation was made.
**Branch:** `run-13-agents-md`
**Date:** 2026-06-05

## Summary

The request is to support `AGENTS.md` as an additional project instruction
file alongside `CLAUDE.md`. After inspecting this repository, **the change is
not feasible here**: the source code that discovers, reads, and injects
`CLAUDE.md` into an agent's context is **not present in this repository**. That
logic lives in the Claude Code CLI / agent harness, which is an external,
separately distributed tool. This repo is a research and documentation project
("failure atlas"), not the agent's source.

No source change was made. No `CLAUDE.md` support was removed. Backward
compatibility is unaffected because no behavior was touched.

## What this repository actually is

`coding-agent-failure-atlas` is a qualitative research project that records how
coding agents behave on small tasks. Per `README.md`, the layout is markdown
field notes plus a few small JavaScript test-fixture apps under
`eval-workspace/`:

- `findings/` — cross-run analysis (taxonomy, summary).
- `runs/` — individual run records.
- `prompts/`, `templates/`, `website-content/` — supporting material.
- `eval-workspace/` — small sample apps (vitest-based) used as task fixtures.

File-type census of the working tree (excluding `.git`): 40 `.md`, 39 `.js`,
12 `.jsx`, 9 `.json`, 2 `.html`. There is no `node_modules`, no `bin/`/`dist/`,
and no dependency on `claude-code` in any `package.json`.

## Files inspected

- `README.md`, `methodology.md` — confirmed the repo's purpose (research notes).
- `eval-workspace/rule-adherence-app/CLAUDE.md` — the only `CLAUDE.md` present;
  it is a *project-rules fixture* (e.g. "Fix only the intended defect", "Do not
  edit test files"), consumed by an agent, not code that loads instructions.
- `package.json` for all three `eval-workspace` apps — only test/build deps
  (vitest, vite); none reference Claude Code or instruction loading.
- Repo-wide search for instruction-loading symbols
  (`CLAUDE.md`, `AGENTS.md`, `readInstructions`, `loadInstructions`,
  `projectInstructions`, `memory file`, etc.).

## Where CLAUDE.md is currently loaded

**Nowhere in this repository.** Every occurrence of `CLAUDE.md` in the tree is
either documentation or a fixture reference, not loading logic:

- `eval-workspace/rule-adherence-app/CLAUDE.md` — the fixture itself.
- `eval-workspace/rule-adherence-app/README.md:6` — "Read `CLAUDE.md` for the
  rules" (prose for a human/agent).
- `eval-workspace/rule-adherence-app/src/legacy/oldTotal.js:1` — a code comment
  pointing readers to `CLAUDE.md`.
- `prompts/run_12_prompt.md`, `runs/run_12.md` — prompts/records that mention
  reading `CLAUDE.md`.

The actual discovery/read/inject path for `CLAUDE.md` is implemented by the
Claude Code CLI (a bundled npm package executed against a repo). That code is
not vendored or referenced here.

## Whether AGENTS.md can share the same loading path

Cannot be determined or implemented from this repository, because the loading
path is not in this repository. The decision and code would belong in the
Claude Code CLI source, not here.

Issue #6235 also does not exist in `haysonko/coding-agent-failure-atlas`
(GitHub returns 404); the number corresponds to the upstream Anthropic
`claude-code` repository, which is where such a feature would be implemented.

## Tests

- Tests found: the `eval-workspace` apps have vitest suites, but they cover the
  fixture apps' own logic (pricing, todo, account migration) and are unrelated
  to instruction loading.
- Tests added: none — there is no code to test for this feature here.
- Final test output: not run, because no source was changed and no relevant
  test surface exists in this repo.

## Diff summary

Documentation only. This note (`notes/issue-6235-agents-md.md`) was added. No
source files were modified, added, or deleted. No existing behavior changed.

## What would need to change (in the right repository)

If/when working in the Claude Code CLI source (not this repo), the smallest
scoped change would roughly be:

1. Locate the project-instruction discovery routine that resolves `CLAUDE.md`
   (walking up the directory tree / checking project, parent, and global
   locations).
2. Extend that routine to also look for `AGENTS.md` at the same locations,
   keeping `CLAUDE.md` as a recognized name (do not remove it).
3. Define and document precedence/merge behavior when both files exist
   (e.g. load both, or prefer one) — this is the main design decision and
   should be settled before coding.
4. Add unit tests covering: only `CLAUDE.md`, only `AGENTS.md`, both present,
   and neither present, asserting backward-compatible behavior for the
   `CLAUDE.md`-only case.

None of these steps are actionable from this repository.

## Uncertainty

- I verified the *absence* of instruction-loading code in this repo's working
  tree; I did not (and cannot from here) inspect the Claude Code CLI internals,
  so the precise function names and merge semantics above are described
  generically rather than confirmed against real source.
- The mapping of "Issue #6235" to the upstream `claude-code` repo is inferred
  from the 404 in this repo plus the feature's nature; I did not fetch the
  upstream issue.
