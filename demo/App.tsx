import React, { useState } from 'react';
import { ColorPicker } from '../src';

export default function App() {
  const [color, setColor] = useState('#ff0000');
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial' }}>
      <h1>react-color-picker demo</h1>
      <p>Selected: <strong>{color}</strong></p>
      <ColorPicker value={color} onChange={setColor} />
    </div>
  );
}
