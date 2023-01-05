# Tech stack

The tech stack used to build the portal.

## Status

Current

## Context

We want to choose a tech stack which supports the following requirements and priorities:

- Must be suitable for an open source portal project (e.g. no proprietary dependencies or libraries which provide corporate branding).
- A11y is important.
- Make use of technologies familiar to likely early contributors.
- Make use of broadly-adopted, popular technologies to enable easy community contributions.

## Decision

- TypeScript.
  - It's very close to JavaScript, and adds strong typing - which improves both quality and the overall developer experience.
- React, bootstrapped with create-react-app.
  - It's familiar to many TTD staff and is a popular front-end framework.
  - [React Router](https://reactrouter.com/en/main) for routing. It's popular and semi-official.
  - [Craco](https://craco.js.org/) for tweaking of the create-react-app Webpack configuration.
    - It allows for changes to the Webpack configuration without ejecting, and supports the latest versions.
- [Sass](https://sass-lang.com/) for styling.
  - It's very close to plain old CSS, while providing a better developer experience.
  - Nothing/minimal additional to learn for developers familiar with the building-blocks of the web.
- [Radix UI](https://www.radix-ui.com/) for components.
  - Easy to style with no branding to override.
  - Accessibility is a priority.
  - A good range of components are available.
- [TestingLibrary](https://testing-library.com/) for front-end tests.
  - It's popular and works well with React.
- [Storybook] for the primary dev experience while working on components.
  - It's popular and allows rapid iteration while developing.
  - It encourages good separation between presentation, state, and data fetching.
