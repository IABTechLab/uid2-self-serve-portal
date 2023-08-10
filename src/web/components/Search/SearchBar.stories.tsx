import { ComponentMeta, ComponentStory } from '@storybook/react';

import { SearchBarContainer, SearchBarInput, SearchBarResults } from './SearchBar';

export default {
  title: 'Shared Components/SearchBar',
  component: SearchBarContainer,
} as ComponentMeta<typeof SearchBarContainer>;

export const basicSearchBar: ComponentStory<typeof SearchBarContainer> = (args) => (
  <SearchBarContainer {...args}>
    <SearchBarInput />
  </SearchBarContainer>
);

export const searchBarWithResults: ComponentStory<typeof SearchBarContainer> = (args) => (
  <SearchBarContainer {...args}>
    <SearchBarInput fullBorder />
    <SearchBarResults>
      <div style={{ padding: '20px' }}>Results would go here!</div>
    </SearchBarResults>
  </SearchBarContainer>
);
