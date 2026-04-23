import { ApiKeysGuard } from './api-keys.guard';

describe('ApiKeysGuard', () => {
  it('should be defined', () => {
    expect(new ApiKeysGuard()).toBeDefined();
  });
});
