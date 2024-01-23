import axios from 'axios';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const handlers = [
  http.get(
    // The "/pets" string is a path predicate.
    // Only the GET requests whose path matches
    // the "/pets" string will be intercepted.
    'http://localhost/pets',
    // The function below is a "resolver" function.
    // It accepts a bunch of information about the
    // intercepted request, and decides how to handle it.
    ({ request, params, cookies }) => {
      return HttpResponse.json(['Tom', 'Jerry', 'Spike']);
    }
  ),
];

const server = setupServer(...handlers);

describe('MSW Test', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should work', async () => {
    console.log(server.listHandlers());

    const response = await axios.get<String[]>(`/pets`);

    expect(response.data).toEqual(['Tom', 'Jerry', 'Spike']);
  });
});
