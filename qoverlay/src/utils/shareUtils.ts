// 共享的分享工具函数

/**
 * 将数字转换为大写格式，禁止使用科学计数法
 * @param num 要转换的数字
 * @returns 格式化后的数字字符串
 */
export function formatNumber(num: number): string {
  // 确保不使用科学计数法
  return num.toLocaleString('zh-CN', {
    notation: 'standard',
    maximumFractionDigits: 0
  });
}

/**
 * 绘制分享内容到Canvas
 * @param canvas Canvas元素
 * @param personAName 人体A名称
 * @param personBName 人体B名称
 * @param overlapAmount 重叠数量
 * @param overlapPercentage 重叠百分比
 * @param appName App名称
 */
export function drawShareContent(
  canvas: HTMLCanvasElement,
  personAName: string,
  personBName: string,
  overlapAmount: number,
  totalQuantum: number,
  appName: string = '量子联结'
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // 背景渐变
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#eef3ff');
  gradient.addColorStop(1, '#c8daff');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const padding = Math.round(width * 0.05);
  const cardWidth = width - padding * 2;
  const cardHeight = height - padding * 2;
  const cardRadius = Math.round(width * 0.03);

  // 绘制白卡片
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, padding, padding, cardWidth, cardHeight, cardRadius, true, false);

  const centerX = width / 2;
  let currentY = padding + Math.round(cardHeight * 0.16);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#1f355f';
  ctx.font = `bold ${Math.round(width * 0.035)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
  [personAName, `与`, personBName, `的量子联结数量`].forEach((line, index) => {
    // 第一行第三行使用较大字体，第二行第四行使用较小字体
    let font = ctx.font;
    let ratio = 0.035;
    let color = '#1f355f';
    if (index === 0 || index === 2) {
      ratio = 0.07;
      color = '#2566ff';
    }
    let fontSize = Math.round(width * ratio);
    font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
    currentY = wrapText(ctx, line, centerX, currentY, cardWidth - padding * 2, Math.round(width * 0.07), color, font);
    currentY += 20;
  });

  ctx.save();

  // currentY += 20;
  // ctx.beginPath();
  // ctx.moveTo(padding + 60, currentY);
  // ctx.lineTo(width - padding - 60, currentY);
  // ctx.strokeStyle = '#e2e8f8';
  // ctx.lineWidth = 2;
  // ctx.stroke();
  currentY += 120;

  const formattedAmount = formatNumber(overlapAmount);
  ctx.fillStyle = '#2566ff';
  ctx.font = `bold ${Math.round(width * 0.12)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
  // ctx.fillText(formattedAmount, centerX, currentY);
  currentY = wrapText(
    ctx, formattedAmount, centerX, currentY, cardWidth - padding * 2, Math.round(width * 0.14)
  )
  // currentY += Math.round(width * 0.14);

  ctx.beginPath();
  ctx.moveTo(padding + 60, currentY);
  ctx.lineTo(width - padding - 60, currentY);
  ctx.strokeStyle = '#e2e8f8';
  ctx.lineWidth = 2;
  ctx.stroke();
  currentY += 40;


  ctx.restore();
  // ctx.fillStyle = '#63718f';
  // ctx.font = `bold ${Math.round(width * 0.05)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
  // const percentageText = ` ${((overlapAmount / totalQuantum) * 100)}%`;
  // ctx.fillText(percentageText, centerX, currentY);
  // currentY += Math.round(width * 0.08);


  // ctx.font = `${Math.round(width * 0.035)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
  ctx.fillStyle = '#8f97b4';
  // ctx.fillText('结果由“量子联结”APP快速计算得出，仅供参考', centerX, currentY);

  ctx.textAlign = 'right';
  ctx.font = `${Math.round(width * 0.028)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
  // ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillText(`结果由“${appName}”快速计算得出，仅供参考`, width - padding - 20, height - padding - 20);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill: boolean,
  stroke: boolean
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  color?: string,
  font?: string
): number {
  ctx.save();
  if (color) ctx.fillStyle = color;
  if (font) ctx.font = font;
  const characters = Array.from(text);
  let line = '';

  for (let i = 0; i < characters.length; i++) {
    const testLine = line + characters[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line !== '') {
      ctx.fillText(line, x, y);
      line = characters[i];
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
  ctx.restore();
  return y;
}

/**
 * 将Canvas转换为base64 URL
 * @param canvas Canvas元素
 * @returns base64 URL
 */
export function canvasToBase64(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png', 1.0);
}

/**
 * 调用系统分享功能
 * @param title 分享标题
 * @param text 分享文本
 * @param imageUrl 图片URL（base64格式）
 * @param successCallback 成功回调
 * @param errorCallback 失败回调
 */
export function shareImage(
  title: string,
  text: string,
  imageUrl: string,
  successCallback?: () => void,
  errorCallback?: (error: Error) => void
): void {
  // 检查是否支持Web Share API
  if (navigator.share) {
    // 创建临时文件
    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'quantum-overlap.png', { type: 'image/png' });
        // 检查是否支持文件分享
        if (navigator.canShare) {
          const shareData = {
            title,
            text,
            files: [file] as File[]
          };

          if (navigator.canShare(shareData)) {
            navigator.share(shareData)
              .then(() => {
                if (successCallback) successCallback();
              })
              .catch(error => {
                if (errorCallback) errorCallback(error);
                else console.error('分享失败:', error);
              });
          } else {
            // 不支持文件分享，使用文本分享
            navigator.share({
              title,
              text,
              url: window.location.href
            })
              .then(() => {
                if (successCallback) successCallback();
              })
              .catch(error => {
                if (errorCallback) errorCallback(error);
                else console.error('分享失败:', error);
              });
          }
        }
      })
      .catch(error => {
        if (errorCallback) errorCallback(error);
        else console.error('创建文件失败:', error);
      });
  } else {
    // 回退方案：复制图片URL到剪贴板
    navigator.clipboard.writeText(imageUrl)
      .then(() => {
        if (successCallback) successCallback();
      })
      .catch(error => {
        if (errorCallback) errorCallback(error);
        else console.error('复制失败:', error);
      });
  }
}
