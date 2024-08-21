import { extractLocationFromPath } from './urlHelpers';

describe('extractLocationFromPath', () => {
  it('should return an empty string for path with nothing after participantId', () => {
    expect(extractLocationFromPath('/participant/8')).toBe('');
  });

  it('should return the correct path for nested routes"', () => {
    expect(extractLocationFromPath('/participant/8/home/test')).toBe('home/test');
  });

  it('should handle case with only participantId in the path', () => {
    expect(extractLocationFromPath('/participant/:participantId')).toBe('');
  });

  it('should return the correct path for a standard route', () => {
    expect(extractLocationFromPath('/participant/8/home')).toBe('home');
  });
});
