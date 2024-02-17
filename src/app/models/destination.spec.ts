import { Destination } from './destination';

describe('Destination', () => {
  it('should create an instance', () => {
    expect(new Destination(0, 0, "Name")).toBeTruthy();
  });
});
