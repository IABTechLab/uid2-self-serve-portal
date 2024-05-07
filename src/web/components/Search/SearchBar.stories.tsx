import { ComponentMeta, ComponentStory } from '@storybook/react';

import { SearchBarContainer, SearchBarInput, SearchBarResults } from './SearchBar';

export default {
  title: 'Shared Components/Search Bar',
  component: SearchBarContainer,
} as ComponentMeta<typeof SearchBarContainer>;

export const BasicSearchBar: ComponentStory<typeof SearchBarContainer> = (args) => (
  <SearchBarContainer {...args}>
    <SearchBarInput />
  </SearchBarContainer>
);

export const SearchBarWithResults: ComponentStory<typeof SearchBarContainer> = (args) => (
  <SearchBarContainer {...args}>
    <SearchBarInput fullBorder />
    <SearchBarResults>
      <div style={{ padding: '20px' }}>Results would go here!</div>
    </SearchBarResults>
  </SearchBarContainer>
);
