import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ColorPicker from '../ColorPicker';

beforeEach(() => { localStorage.clear(); });

describe('modal behavior', () => {
  it('opens custom modal and saves new color to localStorage', async () => {
    const { getByText } = render(<ColorPicker />);
    // open modal via Custom menu entry by programmatically calling openEditor
    // (component exposes no public API; emulate user opening by clicking the toggle then the custom entry)
    const toggle = document.querySelector('.rcp-toggle') as HTMLElement | null;
    expect(toggle).toBeTruthy();
    toggle?.click();
  await waitFor(() => expect(document.querySelector('.rcp-dropdown')).toBeTruthy());
  const customBtn = Array.from(document.querySelectorAll('.rcp-item button')).find(el => el.textContent?.includes('Custom')) as HTMLElement | undefined;
  expect(customBtn).toBeTruthy();
  customBtn?.click();
  await waitFor(() => expect(document.querySelector('.rcp-modal-panel input')).toBeTruthy());
  const input = document.querySelector('.rcp-modal-panel input') as HTMLInputElement | null;
  if (input) fireEvent.change(input, { target: { value: 'MyColor' } });
  const saveBtn = getByText('Save');
  fireEvent.click(saveBtn);
  await waitFor(() => expect(localStorage.getItem('rcp:saved_colors')).toBeTruthy());
  });
});
