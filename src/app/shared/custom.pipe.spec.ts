import { CustomPipe } from './custom.pipe';

describe('Custom pipe', () => {
  it('should return the string "transformed"', () => {
    let cPipe = new CustomPipe();

    let res = cPipe.transform('hello');

    expect(res).toEqual('transformed');
  });
});
