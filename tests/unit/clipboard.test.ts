import { describe, expect, it, vi } from 'vitest';

vi.mock('@tauri-apps/plugin-clipboard-manager', () => ({
  writeText: vi.fn(async () => undefined),
  readText: vi.fn(async () => 'mocked'),
}));

describe('clipboard helper', () => {
  it('reads and writes via the clipboard plugin', async () => {
    const { readClipboard, writeClipboard } = await import('@/lib/clipboard');
    const { readText, writeText } = await import(
      '@tauri-apps/plugin-clipboard-manager'
    );

    await writeClipboard('hello');
    expect(writeText).toHaveBeenCalledWith('hello');

    await expect(readClipboard()).resolves.toBe('mocked');
    expect(readText).toHaveBeenCalled();
  });
});
