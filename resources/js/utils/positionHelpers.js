export function validatePosition(position, dashboardWidth, dashboardHeight, widgetWidth = 300, widgetHeight = 200) {
  if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
    return { x: 100, y: 100 };
  }

  return {
    x: Math.max(0, Math.min(position.x, dashboardWidth - widgetWidth)),
    y: Math.max(0, Math.min(position.y, dashboardHeight - widgetHeight))
  };
}

export function getInitialPosition(clickPosition, dashboardRect, widgetWidth = 300, widgetHeight = 200) {
  if (!clickPosition || !dashboardRect) {
    return { x: 100, y: 100 };
  }

  const x = Math.max(0, Math.min(clickPosition.clientX - dashboardRect.left, dashboardRect.width - widgetWidth));
  const y = Math.max(0, Math.min(clickPosition.clientY - dashboardRect.top, dashboardRect.height - widgetHeight));

  return { x, y };
}