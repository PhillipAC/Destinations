import { Location } from './location';

describe('Destination', () => {
  it('should create an instance', () => {
    expect(new Location(0, 0, "Name")).toBeTruthy();
  });
});
