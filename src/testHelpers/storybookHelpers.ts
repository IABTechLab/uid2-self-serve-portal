export const CreateStory = (story: { render: Function; args: {} }) => {
  return () => story.render(story.args);
};
