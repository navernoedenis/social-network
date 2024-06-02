import { expiredAt, MILLISECONDS_IN } from './expired-at';

describe('test func expired-at', () => {
  test('time adding correctly', () => {
    const endTime = expiredAt(10, 'seconds').getTime();
    const now = new Date().getTime();
    expect(endTime).toBe(now + 10 * MILLISECONDS_IN.seconds);
  });

  test('to be expired', async () => {
    const endTime = expiredAt(1, 'seconds').getTime();
    await delay(1001);
    const now = new Date().getTime();
    expect(now).toBeGreaterThan(endTime);
  });
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
