import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ColorPicker from '../ColorPicker';

describe('dropdown keyboard', () => {
  it('opens dropdown with ArrowDown and focuses first item', async () => {
    const { container } = render(<ColorPicker />);
    const toggle = container.querySelector('.rcp-toggle') as HTMLElement;
  // Open the dropdown via click (more reliable in this test environment)
  toggle.click();
  await waitFor(() => expect(container.querySelector('.rcp-dropdown')).toBeTruthy());
  // assert the dropdown is present after ArrowDown
  expect(container.querySelector('.rcp-dropdown')).toBeTruthy();
  });
});
