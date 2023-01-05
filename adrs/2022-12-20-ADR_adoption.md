# ADR adoption

Architecturally-significant decisions must be summarized by adding an ADR to this register.

## Status

Current

## Context

We want to ensure major decisions related to the UID2 Self-Serve Portal are captured here, for discussion, future reference, and easy developer on-boarding.

## Decision

For every architecturally-significant decision made, a new file should be added to this folder. Not all decisions are significant. Choosing React over Angular is significant. Choosing FontAwesome over some other icon library probably isn't. Use your judgement and if in doubt, ask a few other contributors!

- Name the file using the format `YYYY-MM-DD-Name_of_decision.md`.
- Keep it brief, informative, and relevant. Focus on providing all of the information which is specific to this project. Background material can be linked to.
- Status should be either `Current` or `Deprecated`. If a decision is in-progress and you're looking for feedback, put it on a branch, use `Current` as the status, and use the PR for discussion.
- If a decision changes, update the relevant ADR.
  - If it's useful to know that the decision changed (e.g. some parts of the codebase haven't been updated and it's good to know why), add a note in the `History` section.
  - If a decision is deprecated, leave the most recent revision there, but change the status to `Deprecated`.

While this file should serve as an example of the structure, change it as needed to communicate the decision clearly. This is not a strict template - just a suggestion.

## History

2022-12-20: Initial decision to use ADRs. Put relevant notes about the way this ADR has changed over time here - especially if some parts of the code base reflect the original state of the ADR.
