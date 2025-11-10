import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Field, NumberField, SavedItem } from '../ui/Primitives';

describe('primitives', () => {
  it('Field renders label and children', () => {
    const { getByText } = render(<Field label="Test"><div>Child</div></Field>);
    expect(getByText('Test')).toBeTruthy();
    expect(getByText('Child')).toBeTruthy();
  });

  it('NumberField calls onChange', () => {
    const fn = vi.fn();
    const { getByDisplayValue } = render(<NumberField value={10} onChange={fn} />);
    const input = getByDisplayValue('10') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '12' } });
    expect(fn).toHaveBeenCalled();
  });

  it('SavedItem calls handlers', () => {
    const sel = vi.fn();
    const ed = vi.fn();
    const del = vi.fn();
    const c = { id: 'x', name: 'X', value: '#000' };
    const { getByText, getByLabelText } = render(<ul><SavedItem c={c} onSelect={sel} onEdit={ed} onDelete={del} /></ul>);
    fireEvent.click(getByText('X'));
    expect(sel).toHaveBeenCalled();
    fireEvent.click(getByLabelText('edit-x'));
    expect(ed).toHaveBeenCalled();
    fireEvent.click(getByLabelText('delete-x'));
    expect(del).toHaveBeenCalled();
  });
});
