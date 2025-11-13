import React, { useMemo, useState } from 'react';
import { hexToRgb, hexToCMYK, rgbToHex, tintHex } from './colorUtils';
import ColorModal from './ColorModal';
import useLocalStorage from './hooks/useLocalStorage'
// Field and NumberField are imported from shared primitives
import { SavedItem } from './ui/Primitives';
import { defaultColors } from './defaultColors';

export type Color = {
  Name: string,
  Value: string
};

// hex like #rrggbb
export type ColorPickerProps = {
  value?: Color;
  onChange?: (color: Color) => void;
  label?: string;
};

type SavedColor = {
  "Id": string,
  "Name": string,
  "ColorBrush": null,
  "IsCustom": boolean,
  "ColorType": number,
  "Alpha": number,
  "R": number,
  "G": number,
  "B": number,
  "C": number,
  "M": number,
  "Y": number,
  "K": number,
  "Tint": number,
  "Value": string,
  "IsBlack": boolean,
  "IsWhite": boolean
};

const DEFAULT_COLORS: SavedColor[] = defaultColors;
const STORAGE_KEY = 'rcp:saved_colors';
const STORAGE_SELECTED = 'rcp:selected_color';

const DEFAULT_COLOR: Color = {
  Name: DEFAULT_COLORS[0].Name,
  Value: DEFAULT_COLORS[0].Value
};

const ColorPicker: React.FC<ColorPickerProps> = ({ value = '#ff0000', onChange, label = 'Choose color' }) => {
  const [openEditId, setOpenEditId] = useState<string | null>(null);
  const [editingFormat, setEditingFormat] = useState<'hex' | 'rgb' | 'hsl' | 'tint'>('hex');
  const [editingName, setEditingName] = useState('');
  const [editingValue, setEditingValue] = useState<Color>(DEFAULT_COLOR);
  const [tintPreviewPct, setTintPreviewPct] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useLocalStorage<Color>(STORAGE_SELECTED, DEFAULT_COLOR);
  const [savedColors, setSavedColors] = useLocalStorage<SavedColor[]>(STORAGE_KEY, DEFAULT_COLORS);
  const currentRgb = useMemo(() => hexToRgb(editingValue.Value), [editingValue]);
  const itemsCount = savedColors.length + 1; // saved + custom
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelect = (v: Color) => {
    setSelectedColor(v);
    onChange?.(v);
  };

  // keep dropdown label in sync via color state (no-op retained intentionally)
  const handleDelete = (id: string) => {
    setSavedColors((s) => s.filter((c) => c.Id !== id));
  };

  const openEditor = (id?: string) => {
    if (id) {
      const c = savedColors.find((s) => s.Id === id)!;
      setOpenEditId(id);
      setEditingName(c.Name);
      // setEditingValue(c.Value);
      setEditingFormat('hex');
    } else {
      setOpenEditId("new");
      setEditingName('');
      // setEditingValue('#000000');
      setEditingFormat('hex');
    }
  };

  const saveEdited = () => {
    let finalValue = editingValue.Value;
    const { r, g, b } = hexToRgb(finalValue);
    const { c, m, y, k } = hexToCMYK(finalValue);
    if (editingFormat === 'tint' && tintPreviewPct != null) {
      finalValue = tintHex(editingValue.Value, tintPreviewPct);
    }
    if (openEditId === "new") {
      // new color adding.
      setSavedColors((s) => [...s,
      {
        Id: `c${itemsCount}`,
        Name: editingName || 'Untitled',
        ColorBrush: null,
        IsCustom: true,
        ColorType: 0,
        Alpha: 255,
        R: r,
        G: g,
        B: b,
        C: c,
        M: m,
        Y: y,
        K: k,
        Tint: 0,
        Value: finalValue,
        IsBlack: false,
        IsWhite: false
      }
      ]);
    } else if (openEditId) {
      // update existing color
      setSavedColors((s) => s.map((c) => (c.Id === openEditId ? {
        Id: c.Id,
        Name: editingName,
        ColorBrush: c.ColorBrush,
        IsCustom: c.IsCustom,
        ColorType: 0,
        Alpha: c.Alpha,
        R: c.R,
        G: c.G,
        B: c.B,
        C: c.C,
        M: c.M,
        Y: c.Y,
        K: c.K,
        Tint: c.Tint,
        Value: finalValue,
        IsBlack: c.IsBlack,
        IsWhite: c.IsWhite
      } : c
      )));
    }
    setTintPreviewPct(null);
    setOpenEditId(null);
  };

  const handleRgbChange = (k: 'r' | 'g' | 'b', v: number) => {
    const next = { ...currentRgb, [k]: Math.max(0, Math.min(255, Math.round(v))) };
    setEditingValue(rgbToHex(next.r, next.g, next.b));
  };

  const focusItem = (idx: number) => {
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
          <span className="rcp-swatch" style={{ background: selectedColor }} aria-hidden />
          <span className="rcp-name">{savedColors.find(s => s.Value === selectedColor)?.Name ?? selectedColor}</span>
          <span className="rcp-caret">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </button>
        {dropdownOpen && (
          <div className="rcp-dropdown" role="menu">
            <ul>
              {savedColors.map((c) => (
                <SavedItem
                  key={c.Id}
                  c={c}
                  onSelect={(v) => { handleSelect(v); setDropdownOpen(false); }}
                  onEdit={(id) => { openEditor(id); setDropdownOpen(false); }}
                  onDelete={(id) => { handleDelete(id); setDropdownOpen(false); }}
                  close={() => setDropdownOpen(false)} />
              ))}
              <li key="custom" className="rcp-item">
                <button className="rcp-swatch-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => { openEditor(); setDropdownOpen(false); }}>
                  <span className="rcp-swatch" style={{ background: '#ffffff' }} aria-hidden />
                  <span className="rcp-item-name">Custom color...</span>
                </button>
                <div className="rcp-item-actions">
                  <button aria-label="edit-custom" className="rcp-icon" onMouseDown={(e) => e.preventDefault()} onClick={() => { openEditor(); setDropdownOpen(false); }}>✎</button>
                </div>
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
