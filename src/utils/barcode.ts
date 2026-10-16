// Barcode and QR Code generation utilities

// Simple QR Code generator (creates SVG data URL)
export function generateQRCode(data: string, size: number = 200): string {
  // Simple QR-like pattern generator (visual representation)
  const modules = 21; // QR Code version 1
  const moduleSize = size / modules;
  
  // Create a deterministic pattern based on data
  const hash = simpleHash(data);
  const matrix: boolean[][] = [];
  
  // Initialize matrix
  for (let i = 0; i < modules; i++) {
    matrix[i] = [];
    for (let j = 0; j < modules; j++) {
      matrix[i][j] = false;
    }
  }
  
  // Add finder patterns (top-left, top-right, bottom-left)
  addFinderPattern(matrix, 0, 0);
  addFinderPattern(matrix, 0, modules - 7);
  addFinderPattern(matrix, modules - 7, 0);
  
  // Add timing patterns
  for (let i = 8; i < modules - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }
  
  // Add data modules (simplified)
  let bitIndex = 0;
  const dataBits = hash.toString(2).padStart(128, '0');
  
  for (let i = 0; i < modules; i++) {
    for (let j = 0; j < modules; j++) {
      if (!isReserved(i, j, modules) && bitIndex < dataBits.length) {
        matrix[i][j] = dataBits[bitIndex] === '1';
        bitIndex++;
      }
    }
  }
  
  // Generate SVG
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
  svg += `<rect width="${size}" height="${size}" fill="white"/>`;
  
  for (let i = 0; i < modules; i++) {
    for (let j = 0; j < modules; j++) {
      if (matrix[i][j]) {
        svg += `<rect x="${j * moduleSize}" y="${i * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="black"/>`;
      }
    }
  }
  
  svg += '</svg>';
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function addFinderPattern(matrix: boolean[][], startRow: number, startCol: number) {
  // Outer border
  for (let i = 0; i < 7; i++) {
    matrix[startRow][startCol + i] = true;
    matrix[startRow + 6][startCol + i] = true;
    matrix[startRow + i][startCol] = true;
    matrix[startRow + i][startCol + 6] = true;
  }
  
  // Inner square
  for (let i = 2; i < 5; i++) {
    for (let j = 2; j < 5; j++) {
      matrix[startRow + i][startCol + j] = true;
    }
  }
}

function isReserved(row: number, col: number, modules: number): boolean {
  // Finder patterns
  if ((row < 8 && col < 8) || (row < 8 && col >= modules - 8) || (row >= modules - 8 && col < 8)) {
    return true;
  }
  // Timing patterns
  if (row === 6 || col === 6) {
    return true;
  }
  return false;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Generate barcode (Code 128 style)
export function generateBarcode(data: string, width: number = 200, height: number = 80): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  // White background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);
  
  // Simple barcode pattern
  ctx.fillStyle = 'black';
  
  const barWidth = width / (data.length * 11 + 35);
  let x = 10;
  
  // Start pattern
  const startPattern = '11010010000';
  for (const bit of startPattern) {
    if (bit === '1') {
      ctx.fillRect(x, 5, barWidth, height - 25);
    }
    x += barWidth;
  }
  
  // Data bars
  for (const char of data) {
    const code = char.charCodeAt(0);
    const binary = code.toString(2).padStart(7, '0');
    
    for (const bit of binary) {
      if (bit === '1') {
        ctx.fillRect(x, 5, barWidth, height - 25);
      }
      x += barWidth;
    }
    
    // Separator
    ctx.fillRect(x, 5, barWidth, height - 25);
    x += barWidth;
  }
  
  // Stop pattern
  const stopPattern = '1100010010110';
  for (const bit of stopPattern) {
    if (bit === '1') {
      ctx.fillRect(x, 5, barWidth, height - 25);
    }
    x += barWidth;
  }
  
  // Add text below
  ctx.fillStyle = 'black';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(data, width / 2, height - 5);
  
  return canvas.toDataURL('image/png');
}

// Generate product label with barcode and QR code
export function generateProductLabel(product: { name: string; sku: string; price: number; currency: string }): { barcode: string; qrCode: string } {
  const barcode = generateBarcode(product.sku);
  const qrCode = generateQRCode(JSON.stringify({
    name: product.name,
    sku: product.sku,
    price: product.price,
    currency: product.currency,
  }));
  
  return { barcode, qrCode };
}

// Download barcode/QR code as image
export function downloadCode(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
