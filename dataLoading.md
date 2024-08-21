# Screen-level data loading

We've settled on React Suspense combined with the Async component from React Router as our preferred way of loading data for each screen. In general, data should then be passed in to components using props. This lets us start the data loading process as early as possible and render different parts of a page as soon as the needed data is available.

## Example

Look at [manageParticipants.tsx](./src/web/screens/manageParticipants.tsx) for an example showing:

- Nested suspense/async components.
- Full type safety.
- Components which need to await multiple promises.

Look at [home.tsx](src/web/screens/home.tsx) for an example showing:

- Customized error handling.
- Multi-stage async loader (i.e. you need to await one promise before you start a second fetch).

## Using the pattern

1. Create a loader using `makeLoader` from `react-router-typesafe`, or `makeParticipantLoader` if the calls you are making require a participantId parameter.
   - The loader should set up needed promises and return an object with Promises stored on descriptively-named keys, wrapped in a call to `defer` from `react-router-typesafe`. Don't await the promises in the loader!
   - If you need to await a promise to get an intermediate value, either use a separate async function that returns a promise (e.g. `getSharingCounts` in [home.tsx](src/web/screens/home.tsx)) (preferred) or `.then(...)` (OK for simple/short continuations).
2. Call the hook from your screen-level component: `const data = useLoaderData<typeof loader>();`
3. Wrap parts of your component tree that need async-loaded data in `<Suspense>` components, and provide a fallback loading indicator.
   - `<Suspense fallback={<Loading />}>`
4. Inside that, use the AsyncTypesafe component from [AwaitTypesafe.tsx](./src/web/utils/AwaitTypesafe.tsx).
   - Provide the promise you need to wait for in the `resolve` prop.
   - As the child of AsyncTypesafe, you need to provide an arrow function that accepts that promise.
   - See the outer AsyncTypesafe component in [manageParticipants.tsx](./src/web/screens/manageParticipants.tsx) for an example of using `resolveAll` to wait for multiple promises from the loader.
5. (Optional) Provide a custom error element so errors only affect part of the screen, not the whole screen.
   - Normally, a loader error means the screen won't render - the nearest error boundary will be used.
   - See [home.tsx](src/web/screens/home.tsx) for an example of allowing part of the page to work even if some of the loader promises fail.
6. (Optional) Use the `revalidator` to trigger reloading the data when you change it: `const reloader = useRevalidator();` at the top of your component, and `reloader.revalidate();` after you've saved changes.
   - Don't forget to await your save, otherwise the revalidator might reload data before your action has saved it!
   - React Router can work out when to revalidate without being told, but that relies on us using the React Router form methods. We might be able to get this to work with React Hook Form but haven't looked into it yet.

## Common issues

1. Make sure you're importing `defer`, `makeLoader`, and `useLoaderData` from `react-router-typesafe`, NOT `react-router-dom`. This will hopefully change if/when `react-router-dom` adds typesafe loader support.
2. Make sure you're using `makeLoader` or `makeParticipantLoader` to create your loader function.
3. Make sure your AsyncTypesafe child function returns a single React child. If you have multiple top-level components to return, wrap them in a fragment: `<><div /><div /></>`.
4. You shouldn't need to provide explicit types anywhere. As long as you provide the right generic parameter to the `useLoaderData` hook, everything (including the type of the arrow function inside the AsyncTypesafe component) should be inferred.
