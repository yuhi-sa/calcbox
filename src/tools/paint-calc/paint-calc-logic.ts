export interface PaintCalcInput {
  width: number;      // room width in meters
  depth: number;      // room depth in meters
  height: number;     // room height in meters
  doors: number;      // number of doors (0.8m x 2m each)
  windows: number;    // number of windows (0.9m x 1.2m each)
}

export interface PaintCalcResult {
  totalWallArea: number;       // gross wall area in m²
  doorArea: number;            // total door area in m²
  windowArea: number;          // total window area in m²
  netWallArea: number;         // net paintable area in m²
  paintLiters: number;         // paint needed (coverage: 10m²/L)
  wallpaperRolls: number;      // wallpaper rolls needed (92cm x 10m)
}

const DOOR_WIDTH = 0.8;
const DOOR_HEIGHT = 2.0;
const WINDOW_WIDTH = 0.9;
const WINDOW_HEIGHT = 1.2;
const PAINT_COVERAGE = 10; // m² per liter
const WALLPAPER_ROLL_WIDTH = 0.92; // meters
const WALLPAPER_ROLL_LENGTH = 10;  // meters

export function calculatePaint(input: PaintCalcInput): PaintCalcResult {
  const { width, depth, height, doors, windows } = input;

  const totalWallArea = 2 * (width + depth) * height;
  const doorArea = doors * DOOR_WIDTH * DOOR_HEIGHT;
  const windowArea = windows * WINDOW_WIDTH * WINDOW_HEIGHT;
  const netWallArea = Math.max(0, totalWallArea - doorArea - windowArea);

  const paintLiters = netWallArea / PAINT_COVERAGE;

  // Wallpaper: each roll covers rollWidth * rollLength m²
  const rollArea = WALLPAPER_ROLL_WIDTH * WALLPAPER_ROLL_LENGTH;
  const wallpaperRolls = Math.ceil(netWallArea / rollArea);

  return {
    totalWallArea: Math.round(totalWallArea * 100) / 100,
    doorArea: Math.round(doorArea * 100) / 100,
    windowArea: Math.round(windowArea * 100) / 100,
    netWallArea: Math.round(netWallArea * 100) / 100,
    paintLiters: Math.round(paintLiters * 100) / 100,
    wallpaperRolls,
  };
}
