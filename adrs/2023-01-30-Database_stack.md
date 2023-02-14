# Database stack

Selection of database infrastructure and access/maintenance stack.

## Status

Current

## Context

The self-serve portal will need a database, both to support the authentication layer and to store information for a range of requirements.

## Decision

- We will use MS SQL Server.
  - We need a SQL database of some sort to support use of our likely choice of authentication stack.
  - The team has more experience managing a SQL Server database than other options.
- Queries via [Objection.js](https://vincit.github.io/objection.js/).
  - Good TypeScript support.
  - It supports a range of database servers, giving us some flexibility in case we move to a different database server type.
  - It's available under the MIT license.

## History

2023-30-01: Initial selection of Postgres and some supporting libraries.
