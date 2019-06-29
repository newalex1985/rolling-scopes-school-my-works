class PaintBucket {
  constructor(context) {
    this.context = context;
  }

  static getPixel(imageData, x, y) {
    if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) {
      return [-1, -1, -1, -1];
    }
    const offset = (y * imageData.width + x) * 4;
    return imageData.data.slice(offset, offset + 4);
  }

  static colorsMatch(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  }

  static setPixel(imageData, x, y, color) {
    const offset = (y * imageData.width + x) * 4;
    const imData = imageData;
    [imData.data[offset + 0], imData.data[offset + 1], imData.data[offset + 2]] = color;
    [imData.data[offset + 3]] = color;
  }

  floodFill(x, y, fillColor) {
    // read the pixels in the canvas
    const { width, height } = this.context.canvas;
    const imageData = this.context.getImageData(0, 0, width, height);
    // get the color we're filling
    const targetColor = PaintBucket.getPixel(imageData, x, y);

    // check we are actually filling a different color
    if (!PaintBucket.colorsMatch(targetColor, fillColor)) {
      const pixelsToCheck = [x, y];
      while (pixelsToCheck.length > 0) {
        const yy = pixelsToCheck.pop();
        const xx = pixelsToCheck.pop();

        const currentColor = PaintBucket.getPixel(imageData, xx, yy);
        if (PaintBucket.colorsMatch(currentColor, targetColor)) {
          PaintBucket.setPixel(imageData, xx, yy, fillColor);
          pixelsToCheck.push(xx + 1, yy);
          pixelsToCheck.push(xx - 1, yy);
          pixelsToCheck.push(xx, yy + 1);
          pixelsToCheck.push(xx, yy - 1);
        }
      }

      // put the data back
      this.context.putImageData(imageData, 0, 0);
    }
  }
}

export default PaintBucket;
