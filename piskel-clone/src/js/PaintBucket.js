// function matchStartColor(pixelPos)
// {
//   const r = colorLayer.data[pixelPos];
//   const g = colorLayer.data[pixelPos+1];
//   const b = colorLayer.data[pixelPos+2];

//   return (r == startR && g == startG && b == startB);
// }

// // const pixelStack = [[startX, startY]];
// const pixelStack = [[0, 0]];
// // потом взять откуда надо
// const canvasWidth = 500;
// const drawingBoundTop = 0;

// while (pixelStack.length) {
//   let pixelPos; let reachLeft; let reachRight;
//   const newPos = pixelStack.pop();
//   // x = newPos[0];
//   // y = newPos[1];
//   const [x, y] = newPos;

//   pixelPos = (y * canvasWidth + x) * 4;
//   while (y-- >= drawingBoundTop && matchStartColor(pixelPos)) {
//     pixelPos -= canvasWidth * 4;
//   }
//   pixelPos += canvasWidth * 4;
//   ++y;
//   reachLeft = false;
//   reachRight = false;
//   while(y++ < canvasHeight-1 && matchStartColor(pixelPos))
//   {
//     colorPixel(pixelPos);

//     if(x > 0)
//     {
//       if(matchStartColor(pixelPos - 4))
//       {
//         if(!reachLeft){
//           pixelStack.push([x - 1, y]);
//           reachLeft = true;
//         }
//       }
//       else if(reachLeft)
//       {
//         reachLeft = false;
//       }
//     }

//     if(x < canvasWidth-1)
//     {
//       if(matchStartColor(pixelPos + 4))
//       {
//         if(!reachRight)
//         {
//           pixelStack.push([x + 1, y]);
//           reachRight = true;
//         }
//       }
//       else if(reachRight)
//       {
//         reachRight = false;
//       }
//     }

//     pixelPos += canvasWidth * 4;
//   }
// }
// context.putImageData(colorLayer, 0, 0);


// function colorPixel(pixelPos)
// {
//   colorLayer.data[pixelPos] = fillColorR;
//   colorLayer.data[pixelPos+1] = fillColorG;
//   colorLayer.data[pixelPos+2] = fillColorB;
//   colorLayer.data[pixelPos+3] = 255;
// }

// const canvas = document.querySelector('canvas');
// const ctx1 = canvas.getContext('2d');

// ctx1.beginPath();
// ctx1.moveTo(20, 20);
// ctx1.lineTo(250, 70);
// ctx1.lineTo(270, 120);
// ctx1.lineTo(170, 140);
// ctx1.lineTo(190, 80);
// ctx1.lineTo(100, 60);
// ctx1.lineTo(50, 130);
// ctx1.lineTo(20, 20);
// ctx1.stroke();

// // eslint-disable-next-line no-use-before-define
// floodFill(ctx1, 40, 50, [255, 0, 0, 255]);

// function getPixel(imageData, x, y) {
//   if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) {
//     return [-1, -1, -1, -1];
//   }
//   const offset = (y * imageData.width + x) * 4;
//   return imageData.data.slice(offset, offset + 4);
// }

// function setPixel(imageData, x, y, color) {
//   const offset = (y * imageData.width + x) * 4;
//   // imageData.data[offset + 0] = color[0];
//   // imageData.data[offset + 1] = color[1];
//   // imageData.data[offset + 2] = color[2];
//   // imageData.data[offset + 3] = color[0];
//   const imData = imageData;
//   [imData.data[offset + 0], imData.data[offset + 1], imData.data[offset + 2]] = color;
//   [imData.data[offset + 3]] = color;
// }

// function colorsMatch(a, b) {
//   return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
// }

// function floodFill(ctx, x, y, fillColor) {
//   // read the pixels in the canvas
//   const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

//   // get the color we're filling
//   const targetColor = getPixel(imageData, x, y);

//   // check we are actually filling a different color
//   if (!colorsMatch(targetColor, fillColor)) {
//     const pixelsToCheck = [x, y];
//     while (pixelsToCheck.length > 0) {
//       const yy = pixelsToCheck.pop();
//       const xx = pixelsToCheck.pop();

//       const currentColor = getPixel(imageData, xx, yy);
//       if (colorsMatch(currentColor, targetColor)) {
//         setPixel(imageData, xx, yy, fillColor);
//         pixelsToCheck.push(xx + 1, yy);
//         pixelsToCheck.push(xx - 1, yy);
//         pixelsToCheck.push(xx, yy + 1);
//         pixelsToCheck.push(xx, yy - 1);
//       }
//     }

//     // put the data back
//     ctx.putImageData(imageData, 0, 0);
//   }
// }

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
