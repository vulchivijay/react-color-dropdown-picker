import React, { useEffect, useMemo, useState } from 'react';
import { hexToRgb, rgbToHex, tintHex } from './colorUtils';
import ColorModal from './ColorModal';
import { Field, NumberField } from './ui/Primitives';

export type Color = string; // hex like #rrggbb

export type ColorPickerProps = {
  value?: Color;
  onChange?: (color: Color) => void;
  label?: string;
};

type SavedColor = { id: string; name: string; value: Color };

const DEFAULT_COLORS: SavedColor[] = [
  { id: 'c1', name: 'Red', value: '#ff0000' },
  { id: 'c2', name: 'Green', value: '#00ff00' },
  { id: 'c3', name: 'Blue', value: '#0000ff' },
  { id: 'c4', name: 'Black', value: '#000000' },
  { id: 'c5', name: 'White', value: '#ffffff' }
];

const STORAGE_KEY = 'rcp:saved_colors';
const STORAGE_SELECTED = 'rcp:selected_color';

// Field and NumberField are imported from shared primitives

import { SavedItem } from './ui/Primitives';

const ColorPicker: React.FC<ColorPickerProps> = ({ value = '#ff0000', onChange, label = 'Choose color' }) => {
  const [color, setColor] = useState<Color>(() => {
    try { const s = localStorage.getItem(STORAGE_SELECTED); return s || value } catch { return value }
  });
  const [saved, setSaved] = useState<SavedColor[]>(DEFAULT_COLORS);
  const [openEditId, setOpenEditId] = useState<string | null>(null);
  const [editingFormat, setEditingFormat] = useState<'hex' | 'rgb' | 'hsl' | 'tint'>('hex');
  const [editingName, setEditingName] = useState('');
  const [editingValue, setEditingValue] = useState<Color>(value);
  const [tintPreviewPct, setTintPreviewPct] = useState<number | null>(null);

  const currentRgb = useMemo(() => hexToRgb(editingValue), [editingValue]);

  const handleSelect = (v: Color) => {
    setColor(v);
    onChange?.(v);
  };

  // keep dropdown label in sync via color state (no-op retained intentionally)

  const handleDelete = (id: string) => {
    setSaved((s) => s.filter((c) => c.id !== id));
  };

  const openEditor = (id?: string) => {
    if (id) {
      const c = saved.find((s) => s.id === id)!;
      setOpenEditId(id);
      setEditingName(c.name);
      setEditingValue(c.value);
      setEditingFormat('hex');
    } else {
      setOpenEditId('new');
      setEditingName('');
      setEditingValue('#000000');
      setEditingFormat('hex');
    }
  };

  // load saved colors from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SavedColor[];
        setSaved(parsed.length ? parsed : DEFAULT_COLORS);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // persist saved colors
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch (e) {
      // ignore
    }
  }, [saved]);

  // persist selected color
  useEffect(() => {
    try { localStorage.setItem(STORAGE_SELECTED, color); } catch {}
  }, [color]);

  const saveEdited = () => {
    let finalValue = editingValue;
    if (editingFormat === 'tint' && tintPreviewPct != null) {
      finalValue = tintHex(editingValue, tintPreviewPct);
    }

    if (openEditId === 'new') {
      setSaved((s) => [...s, { id: `c${Date.now()}`, name: editingName || 'Untitled', value: finalValue }]);
    } else if (openEditId) {
      setSaved((s) => s.map((c) => (c.id === openEditId ? { ...c, name: editingName, value: finalValue } : c)));
    }
    setTintPreviewPct(null);
    setOpenEditId(null);
  };

  const handleRgbChange = (k: 'r' | 'g' | 'b', v: number) => {
    const next = { ...currentRgb, [k]: Math.max(0, Math.min(255, Math.round(v))) };
    setEditingValue(rgbToHex(next.r, next.g, next.b));
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const itemsCount = saved.length + 1; // saved + custom

  const focusItem = (idx: number) => {
    setFocusedIndex(idx);
    const el = document.querySelectorAll('.rcp-dropdown .rcp-swatch-btn')[idx] as HTMLElement | undefined;
    el?.focus();
  };

  const onToggleKeyDown = (e: React.KeyboardEvent) => {
  const key = (e as any).key || (e as any).code || (e as any).keyCode || (e as any).which;
  const isDown = key === 'ArrowDown' || key === 'Down' || key === 'ArrowDown' || key === 40 || key === '40';
  const isUp = key === 'ArrowUp' || key === 'Up' || key === 38 || key === '38';
  if (isDown) {
      e.preventDefault();
  setDropdownOpen(true);
  // dropdown rendering is scheduled; delay focusing the first item so it exists in the DOM
  setTimeout(() => focusItem(0), 0);
  } else if (isUp) {
      e.preventDefault();
  setDropdownOpen(true);
  setTimeout(() => focusItem(itemsCount - 1), 0);
    }
  };

  return (
    <div className="rcp-root">
      <div className="rcp-select" tabIndex={0} onBlur={() => setDropdownOpen(false)}>
  <button className="rcp-toggle" onClick={() => setDropdownOpen((s) => !s)} onKeyDown={onToggleKeyDown} aria-haspopup="menu" aria-expanded={dropdownOpen}>
          <span className="rcp-swatch" style={{ background: color }} aria-hidden />
          <span className="rcp-name">{saved.find(s => s.value === color)?.name ?? color}</span>
        </button>
        {dropdownOpen && (
          <div className="rcp-dropdown" role="menu">
            <ul>
              {saved.map((c, idx) => (
                <SavedItem key={c.id} c={c} onSelect={(v) => { handleSelect(v); setDropdownOpen(false); }} onEdit={(id) => { openEditor(id); setDropdownOpen(false); }} onDelete={(id) => { handleDelete(id); setDropdownOpen(false); }} close={() => setDropdownOpen(false)} />
              ))}
              <li className="rcp-item">
                <button className="rcp-swatch-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => { openEditor(); setDropdownOpen(false); }}>
                  <span className="rcp-swatch" style={{ background: '#ffffff' }} aria-hidden />
                  <span className="rcp-item-name">Custom color...</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      <ColorModal
        openEditId={openEditId}
        editingFormat={editingFormat}
        editingName={editingName}
        editingValue={editingValue}
        tintPreviewPct={tintPreviewPct}
        onChangeName={setEditingName}
        onChangeValue={setEditingValue}
        onChangeFormat={(f) => setEditingFormat(f)}
        onChangeTintPct={(p) => setTintPreviewPct(p)}
        onRgbChange={(k, v) => handleRgbChange(k, v)}
        onSave={saveEdited}
        onClose={() => { setTintPreviewPct(null); setOpenEditId(null); }}
      />
    </div>
  );
};

export default ColorPicker;
