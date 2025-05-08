import "@testing-library/jest-dom";

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    prefetch: jest.fn().mockResolvedValue(undefined),
    back: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isReady: true,
  }),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

global.alert = jest.fn();