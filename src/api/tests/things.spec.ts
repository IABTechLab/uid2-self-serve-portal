import { composeStories } from '@storybook/testing-react';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get(
    // The "/pets" string is a path predicate.
    // Only the GET requests whose path matches
    // the "/pets" string will be intercepted.
    '/pets',
    // The function below is a "resolver" function.
    // It accepts a bunch of information about the
    // intercepted request, and decides how to handle it.
    ({ request, params, cookies }) => {
      return HttpResponse.json(['Tom', 'Jerry', 'Spike']);
    }
  )
);

describe('TESTING', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should work', async () => {
    const response = await axios.get<String[]>(`/pets`);

    expect(response).toBeCalledWith(['Tom', 'Jerry', 'Spike']);
  });
});
