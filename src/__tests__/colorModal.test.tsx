import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ColorModal from '../ColorModal';

describe('ColorModal', () => {
  it('renders and interacts', () => {
    const props = {
      openEditId: 'new',
      editingFormat: 'hex' as const,
      editingName: '',
      editingValue: '#000000',
      tintPreviewPct: null as number | null,
      onChangeName: () => {},
      onChangeValue: () => {},
      onChangeFormat: () => {},
      onChangeTintPct: () => {},
      onRgbChange: () => {},
      onSave: () => {},
      onClose: () => {}
    };
    const { getByText } = render(<ColorModal {...props} />);
    expect(getByText('Add color')).toBeTruthy();
  });
});
