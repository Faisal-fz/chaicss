function applyChaiStyles(root = document) {
  const elements = root.querySelectorAll('[class]');
  const log = [];

  const COLORS = {
    red:'#ef4444', blue:'#3b82f6', green:'#22c55e',
    yellow:'#eab308', orange:'#f97316', purple:'#a855f7',
    pink:'#ec4899', white:'#ffffff', black:'#000000',
    gray:'#6b7280', teal:'#14b8a6', indigo:'#6366f1',
    transparent:'transparent'
  };

  function resolveColor(c) {
    if (!c) return null;
    if (c.startsWith('#')) return '#' + c.slice(1);
    return COLORS[c] || c;
  }

  function parseClass(cls) {
    if (!cls.startsWith('chai-')) return null;
    const raw = cls.slice(5); // strip 'chai-'
    const styles = {};

    // Spacing — p, m, px, py, pt, pb, pl, pr, mx, my, mt, mb, ml, mr
    const spacingMatch = raw.match(
      /^(p|m|px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr)-(.+)$/
    );
    if (spacingMatch) {
      const [, prop, val] = spacingMatch;
      const px = val === 'auto' ? 'auto' : parseInt(val) * 4 + 'px';
      const map = {
        p:'padding', m:'margin',
        px:['paddingLeft','paddingRight'],
        py:['paddingTop','paddingBottom'],
        mx: val === 'auto' ? (styles.marginLeft='auto', styles.marginRight='auto', null) : ['marginLeft','marginRight'],
        my:['marginTop','marginBottom'],
        pt:'paddingTop', pb:'paddingBottom',
        pl:'paddingLeft', pr:'paddingRight',
        mt:'marginTop', mb:'marginBottom',
        ml:'marginLeft', mr:'marginRight',
      };
      const target = map[prop];
      if (Array.isArray(target)) {
        target.forEach(k => styles[k] = px);
      } else if (target && typeof target === 'string') {
        styles[target] = px;
      } else if (prop === 'p' || prop === 'm') {
        styles[prop === 'p' ? 'padding' : 'margin'] = px;
      }
      return styles;
    }

    // Background color
    const bgMatch = raw.match(/^bg-(.+)$/);
    if (bgMatch) {
      const c = resolveColor(bgMatch[1]);
      if (c) styles.backgroundColor = c;
      return Object.keys(styles).length ? styles : null;
    }

    // Text color or text utility
    const textMatch = raw.match(/^text-(.+)$/);
    if (textMatch) {
      const t = textMatch[1];
      if (['left','center','right','justify'].includes(t)) {
        styles.textAlign = t;
      } else if (['sm','xs'].includes(t)) {
        styles.fontSize = t === 'xs' ? '10px' : '12px';
      } else if (t === 'md') { styles.fontSize = '16px'; }
      else if (t === 'lg') { styles.fontSize = '20px'; }
      else if (t === 'xl') { styles.fontSize = '24px'; }
      else if (t === '2xl') { styles.fontSize = '30px'; }
      else if (t === '3xl') { styles.fontSize = '36px'; }
      else {
        const c = resolveColor(t);
        if (c) styles.color = c;
      }
      return Object.keys(styles).length ? styles : null;
    }

    // Border
    if (raw === 'border') { styles.border = '1px solid #d1d5db'; return styles; }
    const borderWidthMatch = raw.match(/^border-(d+)$/);
    if (borderWidthMatch) {
      styles.border = borderWidthMatch[1] + 'px solid #d1d5db'; return styles;
    }
    const borderColorMatch = raw.match(/^border-(.+)$/);
    if (borderColorMatch && !['t','b','l','r','x','y'].includes(borderColorMatch[1][0])) {
      const c = resolveColor(borderColorMatch[1]);
      if (c) { styles.borderColor = c; return styles; }
    }

    // Border-radius
    const roundedMap = { '':'4px', 'sm':'2px', 'md':'6px', 'lg':'8px', 'xl':'12px', '2xl':'16px', 'full':'9999px' };
    const roundedMatch = raw.match(/^rounded(?:-(.*))?$/);
    if (roundedMatch) {
      styles.borderRadius = roundedMap[roundedMatch[1] || ''] || roundedMatch[1];
      return styles;
    }

    // Display
    if (raw === 'flex') { styles.display = 'flex'; return styles; }
    if (raw === 'block') { styles.display = 'block'; return styles; }
    if (raw === 'inline') { styles.display = 'inline'; return styles; }
    if (raw === 'inline-flex') { styles.display = 'inline-flex'; return styles; }
    if (raw === 'grid') { styles.display = 'grid'; return styles; }
    if (raw === 'hidden') { styles.display = 'none'; return styles; }

    // Flex utils
    if (raw === 'flex-col') { styles.flexDirection = 'column'; return styles; }
    if (raw === 'flex-row') { styles.flexDirection = 'row'; return styles; }
    if (raw === 'flex-wrap') { styles.flexWrap = 'wrap'; return styles; }
    if (raw === 'items-center') { styles.alignItems = 'center'; return styles; }
    if (raw === 'items-start') { styles.alignItems = 'flex-start'; return styles; }
    if (raw === 'items-end') { styles.alignItems = 'flex-end'; return styles; }
    if (raw === 'justify-center') { styles.justifyContent = 'center'; return styles; }
    if (raw === 'justify-between') { styles.justifyContent = 'space-between'; return styles; }
    if (raw === 'justify-end') { styles.justifyContent = 'flex-end'; return styles; }

    // Gap
    const gapMatch = raw.match(/^gap-(d+)$/);
    if (gapMatch) { styles.gap = parseInt(gapMatch[1]) * 4 + 'px'; return styles; }

    // Width / Height
    const wMatch = raw.match(/^w-(.+)$/);
    if (wMatch) {
      styles.width = wMatch[1] === 'full' ? '100%' : wMatch[1] === 'auto' ? 'auto' : parseInt(wMatch[1]) * 4 + 'px';
      return styles;
    }
    const hMatch = raw.match(/^h-(.+)$/);
    if (hMatch) {
      styles.height = hMatch[1] === 'full' ? '100%' : hMatch[1] === 'auto' ? 'auto' : parseInt(hMatch[1]) * 4 + 'px';
      return styles;
    }

    // Font
    if (raw === 'font-bold') { styles.fontWeight = '700'; return styles; }
    if (raw === 'font-medium') { styles.fontWeight = '500'; return styles; }
    if (raw === 'font-normal') { styles.fontWeight = '400'; return styles; }
    if (raw === 'italic') { styles.fontStyle = 'italic'; return styles; }
    if (raw === 'uppercase') { styles.textTransform = 'uppercase'; return styles; }
    if (raw === 'lowercase') { styles.textTransform = 'lowercase'; return styles; }
    if (raw === 'capitalize') { styles.textTransform = 'capitalize'; return styles; }
    if (raw === 'underline') { styles.textDecoration = 'underline'; return styles; }
    if (raw === 'line-through') { styles.textDecoration = 'line-through'; return styles; }

    // Opacity
    const opMatch = raw.match(/^opacity-(d+)$/);
    if (opMatch) { styles.opacity = parseInt(opMatch[1]) / 100; return styles; }

    // Shadow
    if (raw === 'shadow') { styles.boxShadow = '0 1px 3px rgba(0,0,0,0.12),0 1px 2px rgba(0,0,0,0.07)'; return styles; }
    if (raw === 'shadow-lg') { styles.boxShadow = '0 10px 30px rgba(0,0,0,0.15)'; return styles; }

    // Cursor
    const cursorMatch = raw.match(/^cursor-(.+)$/);
    if (cursorMatch) { styles.cursor = cursorMatch[1]; return styles; }

    // Overflow
    const overflowMatch = raw.match(/^overflow-(.+)$/);
    if (overflowMatch) { styles.overflow = overflowMatch[1]; return styles; }

    // Position
    if (['relative','absolute','fixed','sticky'].includes(raw)) {
      styles.position = raw; return styles;
    }

    // Z-index
    const zMatch = raw.match(/^z-(d+)$/);
    if (zMatch) { styles.zIndex = zMatch[1]; return styles; }

    return null;
  }
console.log('Starting to apply Chai styles...', elements);
  elements.forEach(el => {
    console.log("Processing element:", el);
    const classes = [...el.classList];
    console.log("Classes found:", classes);
    const chaiClasses = classes.filter(c => c.startsWith('chai-'));
    chaiClasses.forEach(cls => {
      console.log("Applying class:", cls);
      const styles = parseClass(cls);
      console.log("Resolved styles:", styles);
      if (styles) {
        Object.assign(el.style, styles);
        el.classList.remove(cls);
        log.push({ cls, styles });
      }
    });
  });

  return log;
}