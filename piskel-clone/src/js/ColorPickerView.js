class ColorPickerView {
  constructor(numColor, stylePaletteColor) {
    this.colorPicker = document.createElement('div');
    this.numColor = numColor;
    this.stylePaletteColor = stylePaletteColor;
    this.currentColor = `rgb(${0}, ${0}, ${0})`;
  }

  init(parent) {
    const { numColor, stylePaletteColor } = this;
    this.colorPicker.classList.add('color-picker');
    ColorPickerView.generatePalette(this.colorPicker, { numColor, stylePaletteColor });
    parent.appendChild(this.colorPicker);
  }

  static generatePalette(parent, { numColor, stylePaletteColor }) {
    // generation pallete, total numColor^3 colors
    for (let r = 0; r < numColor; r += 1) {
      for (let g = 0; g < numColor; g += 1) {
        for (let b = 0; b < numColor; b += 1) {
          const paletteColor = document.createElement('div');
          paletteColor.classList.add(stylePaletteColor);
          paletteColor.setAttribute('paletteColor', true);
          const rCh = Math.round(r * 255 / (numColor - 1));
          const gCh = Math.round(g * 255 / (numColor - 1));
          const bCh = Math.round(b * 255 / (numColor - 1));
          paletteColor.style.backgroundColor = `rgb(${rCh}, ${gCh}, ${bCh})`;
          parent.appendChild(paletteColor);
        }
      }
    }
  }

  addListeners() {
    this.colorPicker.addEventListener('click', (e) => {
      if (e.target.hasAttribute('paletteColor')) {
        this.currentColor = e.target.style.backgroundColor;
      }
    });
  }
}

export default ColorPickerView;
