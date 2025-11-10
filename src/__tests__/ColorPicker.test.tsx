import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ColorPicker from '../ColorPicker';

describe('ColorPicker', () => {
  it('renders and triggers onChange when selecting from dropdown', async () => {
    const handle = vi.fn();
    const { container } = render(<ColorPicker value="#00ff00" onChange={handle} label="test-color" />);
    // initial label should show the saved name for the provided value
    expect(container.querySelector('.rcp-name')?.textContent).toBe('Green');

  const toggle = container.querySelector('.rcp-toggle') as HTMLElement;
  toggle.click();
  await waitFor(() => expect(container.querySelector('.rcp-dropdown')).toBeTruthy());
  const firstBtn = container.querySelector('.rcp-dropdown .rcp-item button') as HTMLElement;
  expect(firstBtn).toBeTruthy();
  fireEvent.click(firstBtn);
    // first saved color is Red (#ff0000)
    expect(handle).toHaveBeenCalledWith('#ff0000');
  });
});
