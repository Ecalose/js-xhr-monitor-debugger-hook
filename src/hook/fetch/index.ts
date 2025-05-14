import { FetchHook } from './fetch-hook';

/**
 * 为fetch API添加hook
 * @returns {void}
 */
export function addFetchHook(): void {
    new FetchHook().addHook();
}

export {
    FetchHook
}; 