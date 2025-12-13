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
  overlapPercentage: number,
  appName: string = '量子联结'
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 设置Canvas尺寸
  const width = canvas.width;
  const height = canvas.height;

  // 清空Canvas
  ctx.clearRect(0, 0, width, height);

  // 设置背景色
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // 绘制边框
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, width, height);

  // 设置文本样式
  ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  ctx.fillStyle = '#333333';
  ctx.textAlign = 'center';

  // 绘制标题文本
  const title = `${personAName}体内来自${personBName}的量子累计数量：`;
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  ctx.fillText(title, width / 2, 60);

  // 绘制重叠数量（大写数字格式）
  const formattedAmount = formatNumber(overlapAmount);
  ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  ctx.fillStyle = '#007aff';
  ctx.fillText(formattedAmount, width / 2, 140);

  // 绘制百分比
  ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  ctx.fillStyle = '#666666';
  const percentageText = `${(overlapPercentage * 100).toFixed(4)}%`;
  ctx.fillText(percentageText, width / 2, 180);

  // 绘制分隔线
  ctx.beginPath();
  ctx.moveTo(40, 220);
  ctx.lineTo(width - 40, 220);
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 绘制说明文本
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  ctx.fillStyle = '#999999';
  ctx.fillText('数据来源于量子重叠计算工具', width / 2, 260);

  // 绘制水印
  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.textAlign = 'right';
  ctx.fillText(appName, width - 20, height - 20);
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
