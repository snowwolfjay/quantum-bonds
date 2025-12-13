// 速算版本算法实现

// 定义常量系数
const QUANTUM_COEFFICIENT = 1.0e6; // 量子数量计算系数
const DIRECT_EXCHANGE_COEFFICIENT = 1.0e-4; // 直接量子交换量系数
const INDIRECT_EXCHANGE_COEFFICIENT = 5.0e-5; // 间接量子交换量系数
const TRANSITION_EXCHANGE_COEFFICIENT = 1.0e-6; // 跃迁量子交换量系数

// 定义坐标类型
interface Coordinates {
  lat: number;
  lon: number;
}

// 定义人员参数类型
export interface QuickCalcParams {
  personA: {
    location: Coordinates;
    weight: number;
    height: number;
  };
  personB: {
    location: Coordinates;
    weight: number;
    height: number;
  };
  minimumAge: number;
}



// 计算两点之间的距离（米）
function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371e3; // 地球半径，单位：米
  const φ1 = (coord1.lat * Math.PI) / 180;
  const φ2 = (coord2.lat * Math.PI) / 180;
  const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const Δλ = ((coord2.lon - coord1.lon) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 距离，单位：米
}

// 计算量子数量
function calculateQuantumCount(weight: number, height: number): number {
  return weight * height * QUANTUM_COEFFICIENT;
}

// 计算共生时间（分钟）
function calculateSymbiosisTime(minimumAge: number): number {
  // 将最小年龄转换为分钟
  return minimumAge * 365 * 24 * 60;
}

// 计算平均距离（假设为当前距离）
function calculateAverageDistance(distance: number): number {
  // 简化处理，使用当前距离作为平均距离
  return distance;
}

// 估算分钟级量子交换数量
function estimateMinuteExchangeRate(quantumCount: number): number {
  // 简化处理，基于量子总数的一定比例
  return quantumCount * 1.0e-9;
}

// 计算直接量子交换量
function calculateDirectExchange(quantumExchangeRate: number, distance: number): number {
  // 与距离成反比
  const distanceFactor = 1.0 / (1.0 + distance / 1000.0); // 距离因子，1公里以内影响较大
  return DIRECT_EXCHANGE_COEFFICIENT * quantumExchangeRate * distanceFactor;
}

// 计算间接量子交换量
function calculateIndirectExchange(quantumExchangeRate: number): number {
  // 简化处理，不考虑人口密度
  return INDIRECT_EXCHANGE_COEFFICIENT * quantumExchangeRate;
}

// 计算跃迁量子交换量
function calculateTransitionExchange(quantumExchangeRate: number, distance: number): number {
  // 与距离成正比
  const distanceFactor = distance / 1000.0; // 距离因子，以公里为单位
  return TRANSITION_EXCHANGE_COEFFICIENT * quantumExchangeRate * distanceFactor;
}

// 主计算函数
export function calculateQuickQuantumOverlap(params: QuickCalcParams): number {
  // 1. 计算A和B的量子数量
  const quantumCountA = calculateQuantumCount(params.personA.weight, params.personA.height);
  const quantumCountB = calculateQuantumCount(params.personB.weight, params.personB.height);

  // 2. 计算共生时间（分钟）
  const symbiosisTime = calculateSymbiosisTime(params.minimumAge);

  // 3. 计算距离（米）
  const distance = calculateDistance(params.personA.location, params.personB.location);
  const averageDistance = calculateAverageDistance(distance);

  // 4. 估算A的分钟级量子交换数量
  const quantumExchangeRateA = estimateMinuteExchangeRate(quantumCountA);
  const quantumExchangeRateB = estimateMinuteExchangeRate(quantumCountB);

  // 5. 计算各种量子交换量
  // A到B的交换量
  const directExchangeAtoB = calculateDirectExchange(quantumExchangeRateA, averageDistance);
  const indirectExchangeAtoB = calculateIndirectExchange(quantumExchangeRateA);
  const transitionExchangeAtoB = calculateTransitionExchange(quantumExchangeRateA, averageDistance);

  // B到A的交换量
  const directExchangeBtoA = calculateDirectExchange(quantumExchangeRateB, averageDistance);
  const indirectExchangeBtoA = calculateIndirectExchange(quantumExchangeRateB);
  const transitionExchangeBtoA = calculateTransitionExchange(quantumExchangeRateB, averageDistance);

  // 总交换量（A到B和B到A的平均值）
  const totalExchangePerMinute = (
    directExchangeAtoB + indirectExchangeAtoB + transitionExchangeAtoB +
    directExchangeBtoA + indirectExchangeBtoA + transitionExchangeBtoA
  ) / 2;

  // 累计量子重叠数量
  const totalOverlap = totalExchangePerMinute * symbiosisTime;

  return totalOverlap;
}