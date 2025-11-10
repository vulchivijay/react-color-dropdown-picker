# react-color-picker

A tiny accessible React color picker component.

Usage

```tsx
import { ColorPicker } from 'react-color-picker';

<ColorPicker value="#ff0000" onChange={(c) => {/* handle color change */}} />
```

Props

- `value?: string` - hex color string like `#rrggbb`
- `onChange?: (color: string) => void` - called when the color changes
- `label?: string` - aria label for the input

Dev

Install dependencies and run tests/build:

```powershell
npm install
npm run build
npm test
```
