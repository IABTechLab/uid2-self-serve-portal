import { Meta, StoryObj } from '@storybook/react';

import { SearchBarContainer, SearchBarInput, SearchBarResults } from './SearchBar';

const meta: Meta<typeof SearchBarContainer> = {
  title: 'Shared Components/Search Bar',
  component: SearchBarContainer,
};

export default meta;
type Story = StoryObj<typeof SearchBarContainer>;

export const BasicSearchBar: Story = {
  render: (args) => (
    <SearchBarContainer {...args}>
      <SearchBarInput />
    </SearchBarContainer>
  ),
};

export const SearchBarWithResults: Story = {
  render: (args) => (
    <SearchBarContainer {...args}>
      <SearchBarInput fullBorder />
      <SearchBarResults>
        <div style={{ padding: '20px' }}>Results would go here!</div>
      </SearchBarResults>
    </SearchBarContainer>
  ),
};
