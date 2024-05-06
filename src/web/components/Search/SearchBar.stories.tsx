import { Meta, StoryObj } from '@storybook/react';

import { SearchBarContainer, SearchBarInput, SearchBarResults } from './SearchBar';

export default {
  title: 'Shared Components/SearchBar',
  component: SearchBarContainer,
} as Meta<typeof SearchBarContainer>;

export const BasicSearchBar: StoryObj<typeof SearchBarContainer> = {
  render: (args) => (
    <SearchBarContainer {...args}>
      <SearchBarInput />
    </SearchBarContainer>
  ),
};

export const SearchBarWithResults: StoryObj<typeof SearchBarContainer> = {
  render: (args) => (
    <SearchBarContainer {...args}>
      <SearchBarInput fullBorder />
      <SearchBarResults>
        <div style={{ padding: '20px' }}>Results would go here!</div>
      </SearchBarResults>
    </SearchBarContainer>
  ),
};
