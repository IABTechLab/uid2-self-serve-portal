# Self-Serve Portal

This is the self-serve portal for UID2 participants. It enables a range of operations for participants around key management, sharing, and so on.

# Getting started

## Database setup and docker

TODO: Add information about this!

## Tech Choices

- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
- We are making use of the [Radix-UI headless component library](https://www.radix-ui.com/). Please prefer components from this library if you need to introduce a new component. You should review the documentation, especially RE: accessibility.
- Styling is done using Sass. It's very close to plain CSS and is very widely used.
- Storybook. See the section below on how we use Storybook.
- See `/adrs/2022-12-21-Tech_stack.md` for more info.

## Storybook

All components below the page level should be props-driven - data fetching should only happen at the routing level. This allows use of upcoming React features such as progressive rendering, and also enables rapid-iteration development using Storybook.

When developing new components, you should create new stories in Storybook for the key states to allow easy review of both visuals and functionality.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed! Note that builds for deployment are not made on developer machines - those happen in our CI pipeline.

### `npm run storybook`

Starts Storybook. This is a great system for working on self-contained components and reviewing appearance and functionality of components across the site.

### `npm run build-storybook`

Build the Storybook site into a static website, if you need that for some reason. (Should this be removed? I don't know if it's needed.)
