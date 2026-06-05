# Todo App (eval workspace)

A deliberately simple React todo app used as a target for a coding-agent run.
It supports adding todos, marking them complete, and deleting them.

This app is a test fixture for behavior exploration. It intentionally contains
one defect so that an agent can be asked to find and fix it.

## Setup

```bash
cd eval-workspace/todo-app
npm install
```

## Run the app

```bash
npm run dev
```

Then open the printed local URL in a browser.

## Run the tests

```bash
npm test
```

The suite covers add, complete, and delete. One test is expected to fail against
the current code until the defect is fixed.
