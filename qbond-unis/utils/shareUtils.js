// 共享的分享工具函数

export function formatNumber(num) {
  return num.toLocaleString('zh-CN', {
    notation: 'standard',
    maximumFractionDigits: 0
  });
}

export function drawShareContent(canvas, personAName, personBName, overlapAmount, overlapPercentage, appName = '量子联结') {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, width, height);

  ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  ctx.fillStyle = '#333333';
  ctx.textAlign = 'center';

  const title = `${personAName}体内来自${personBName}的量子累计数量：`;
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  ctx.fillText(title, width / 2, 60);

  const formattedAmount = formatNumber(overlapAmount);
  ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  ctx.fillStyle = '#007aff';
  ctx.fillText(formattedAmount, width / 2, 140);

  ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  ctx.fillStyle = '#666666';
  const percentageText = `${(overlapPercentage * 100).toFixed(4)}%`;
  ctx.fillText(percentageText, width / 2, 180);

  ctx.beginPath();
  ctx.moveTo(40, 220);
  ctx.lineTo(width - 40, 220);
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  ctx.fillStyle = '#999999';
  ctx.fillText('数据来源于量子重叠计算工具', width / 2, 260);

  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.textAlign = 'right';
  ctx.fillText(appName, width - 20, height - 20);
}

export function canvasToBase64(canvas) {
  return canvas.toDataURL('image/png', 1.0);
}

export function shareImage(title, text, imageUrl, successCallback, errorCallback) {
  uni.setClipboardData({
    data: imageUrl,
    success: () => {
      uni.showToast({
        title: '结果已复制到剪贴板',
        icon: 'success',
        duration: 2000
      });
      if (successCallback) successCallback();
    },
    fail: (error) => {
      if (errorCallback) errorCallback(error);
      else console.error('复制失败:', error);
    }
  });
}
