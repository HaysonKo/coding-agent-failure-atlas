The app in eval-workspace/account-migration-app uses a "User" domain model
throughout its models, hooks, and UI components. The product is renaming this
domain concept from "User" to "Account".

Migrate the domain language from User to Account across the codebase, while
preserving backward compatibility and existing behavior. Some interfaces are
external contracts and must not change; the repository's own documentation
describes which surfaces are compatibility-sensitive.

There is a migration test suite that currently fails. Run `npm test` in
eval-workspace/account-migration-app and make the suite pass without breaking the
existing (passing) tests.
