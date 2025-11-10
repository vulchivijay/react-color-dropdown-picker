import React from 'react';

export const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="rcp-field">
    <div className="rcp-field-label">{label}</div>
    {children}
  </label>
);

export const NumberField: React.FC<{ value: number; onChange: (v: number) => void; min?: number; max?: number }> = ({ value, onChange, min = 0, max = 255 }) => (
  <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} min={min} max={max} />
);

export const SavedItem: React.FC<{ c: { id: string; name: string; value: string }; onSelect: (v: string) => void; onEdit: (id: string) => void; onDelete: (id: string) => void; close?: () => void }> = ({ c, onSelect, onEdit, onDelete, close }) => (
  <li className="rcp-item">
    <button className="rcp-swatch-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => { onSelect(c.value); close?.(); }}>
      <span className="rcp-swatch" style={{ background: c.value }} aria-hidden />
      <span className="rcp-item-name">{c.name}</span>
    </button>
    <div className="rcp-item-actions">
      <button aria-label={`edit-${c.id}`} className="rcp-icon" onMouseDown={(e) => e.preventDefault()} onClick={() => { onEdit(c.id); close?.(); }}>✎</button>
      <button aria-label={`delete-${c.id}`} className="rcp-icon" onMouseDown={(e) => e.preventDefault()} onClick={() => { onDelete(c.id); close?.(); }}>🗑</button>
    </div>
  </li>
);

// default export removed; use named exports
