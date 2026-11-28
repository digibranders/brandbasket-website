export interface OrderViewBounds {
  readonly left: number;
  readonly right: number;
  readonly bottom: number;
  readonly top: number;
}

/** Center the projected workshop and leave a small safety margin around the moving parts. */
export function fitOrderScene(bounds: OrderViewBounds, aspect: number): OrderViewBounds {
  const padding = 1.018;
  const centerX = (bounds.left + bounds.right) / 2;
  const centerY = (bounds.bottom + bounds.top) / 2;
  const halfWidth = Math.max(bounds.right - bounds.left, (bounds.top - bounds.bottom) * aspect) * padding / 2;
  const halfHeight = halfWidth / aspect;
  return {
    left: centerX - halfWidth,
    right: centerX + halfWidth,
    bottom: centerY - halfHeight,
    top: centerY + halfHeight,
  };
}
