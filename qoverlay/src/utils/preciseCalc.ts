// 精算版本算法实现

// 定义常量系数
const QUANTUM_COEFFICIENT = 1.0e6; // 量子数量计算系数

// 定义坐标类型
interface Coordinates {
  lat: number;
  lon: number;
}

// 定义量子类型
enum QuantumType {
  WATER = 'water',
  OXYGEN = 'oxygen',
  OTHER = 'other'
}

// 定义传播方式
enum TransmissionMethod {
  RESPIRATION = 'respiration',
  EVAPORATION = 'evaporation',
  THERMAL_MOTION = 'thermalMotion',
  EXTERNAL_FORCE = 'externalForce',
  QUANTUM_TRANSITION = 'quantumTransition'
}

// 定义人员参数类型
export interface PreciseCalcParams {
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

// 定义结果类型
export interface PreciseCalcResult {
  overlapAmount: number;
  overlapPercentage: number;
  transmissionRates: Record<string, number>;
  quantumTypeRates: Record<string, number>;
}

// 解析位置坐标字符串为经纬度
export function parseLocation(locationStr: string): Coordinates {
  const [lat, lon] = locationStr.split(',').map(coord => parseFloat(coord.trim()));
  return { lat, lon };
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

// 获取各种扩散方式的占比
function getTransmissionMethodProportions(): Record<TransmissionMethod, number> {
  // 基于文档和假设的扩散方式占比
  return {
    [TransmissionMethod.RESPIRATION]: 0.35,
    [TransmissionMethod.EVAPORATION]: 0.25,
    [TransmissionMethod.THERMAL_MOTION]: 0.20,
    [TransmissionMethod.EXTERNAL_FORCE]: 0.15,
    [TransmissionMethod.QUANTUM_TRANSITION]: 0.05
  };
}

// 获取各种量子在不同传播方式下的占比
function getQuantumTypeProportionsByMethod(): Record<TransmissionMethod, Record<QuantumType, number>> {
  // 基于文档和假设的量子类型在不同传播方式下的占比
  return {
    [TransmissionMethod.RESPIRATION]: {
      [QuantumType.WATER]: 0.60,
      [QuantumType.OXYGEN]: 0.35,
      [QuantumType.OTHER]: 0.05
    },
    [TransmissionMethod.EVAPORATION]: {
      [QuantumType.WATER]: 0.95,
      [QuantumType.OXYGEN]: 0.03,
      [QuantumType.OTHER]: 0.02
    },
    [TransmissionMethod.THERMAL_MOTION]: {
      [QuantumType.WATER]: 0.40,
      [QuantumType.OXYGEN]: 0.30,
      [QuantumType.OTHER]: 0.30
    },
    [TransmissionMethod.EXTERNAL_FORCE]: {
      [QuantumType.WATER]: 0.50,
      [QuantumType.OXYGEN]: 0.20,
      [QuantumType.OTHER]: 0.30
    },
    [TransmissionMethod.QUANTUM_TRANSITION]: {
      [QuantumType.WATER]: 0.30,
      [QuantumType.OXYGEN]: 0.30,
      [QuantumType.OTHER]: 0.40
    }
  };
}

// 计算不同传播方式的扩散抵达率
function calculateTransmissionArrivalRates(distance: number): Record<TransmissionMethod, number> {
  // 扩散抵达率是一个和距离相关的函数
  return {
    [TransmissionMethod.RESPIRATION]: 1.0 / (1.0 + Math.pow(distance / 100, 2)), // 呼吸传播，短距离效果好
    [TransmissionMethod.EVAPORATION]: 1.0 / (1.0 + Math.pow(distance / 500, 1.5)), // 蒸发传播，中等距离
    [TransmissionMethod.THERMAL_MOTION]: 1.0 / (1.0 + Math.pow(distance / 1000, 1.2)), // 热运动，较长距离
    [TransmissionMethod.EXTERNAL_FORCE]: 1.0 / (1.0 + Math.pow(distance / 2000, 1.0)), // 外力，长距离
    [TransmissionMethod.QUANTUM_TRANSITION]: 0.5 * Math.exp(-distance / 10000) // 量子跃迁，远距离但概率低
  };
}

// 主计算函数
export function calculatePreciseQuantumOverlap(params: PreciseCalcParams): PreciseCalcResult {
  // 1. 计算A的量子数量
  const quantumCountA = calculateQuantumCount(params.personA.weight, params.personA.height);

  // 2. 计算共生时间（分钟）
  const symbiosisTime = calculateSymbiosisTime(params.minimumAge);

  // 3. 计算距离（米）
  const distance = calculateDistance(params.personA.location, params.personB.location);

  // 4. 获取各种扩散方式的占比
  const transmissionMethodProportions = getTransmissionMethodProportions();

  // 5. 获取各种量子在不同传播方式下的占比
  const quantumTypeProportionsByMethod = getQuantumTypeProportionsByMethod();

  // 6. 计算不同传播方式的扩散抵达率
  const transmissionArrivalRates = calculateTransmissionArrivalRates(distance);

  // 7. 计算各种量子类型的总扩散量
  let totalOverlap = 0;
  const quantumTypeOverlap: Record<QuantumType, number> = {
    [QuantumType.WATER]: 0,
    [QuantumType.OXYGEN]: 0,
    [QuantumType.OTHER]: 0
  };

  // 遍历所有传播方式
  for (const method of Object.values(TransmissionMethod)) {
    // 该传播方式的总占比
    const methodProportion = transmissionMethodProportions[method];
    
    // 该传播方式的抵达率
    const arrivalRate = transmissionArrivalRates[method];
    
    // 遍历所有量子类型
    for (const quantumType of Object.values(QuantumType)) {
      // 该量子类型在该传播方式下的占比
      const quantumTypeProportion = quantumTypeProportionsByMethod[method][quantumType];
      
      // 计算该量子类型通过该传播方式的扩散量
      // 简化处理：基于量子总数、传播方式占比、量子类型占比和抵达率
      const quantumOverlap = quantumCountA * methodProportion * quantumTypeProportion * arrivalRate * 1.0e-9 * symbiosisTime;
      
      // 累加到总重叠量
      totalOverlap += quantumOverlap;
      quantumTypeOverlap[quantumType] += quantumOverlap;
    }
  }

  // 8. 计算量子重叠百分比
  const overlapPercentage = totalOverlap / quantumCountA;

  // 9. 构建结果
  return {
    overlapAmount: totalOverlap,
    overlapPercentage: overlapPercentage,
    transmissionRates: transmissionArrivalRates,
    quantumTypeRates: {
      [QuantumType.WATER]: quantumTypeOverlap[QuantumType.WATER] / quantumCountA,
      [QuantumType.OXYGEN]: quantumTypeOverlap[QuantumType.OXYGEN] / quantumCountA,
      [QuantumType.OTHER]: quantumTypeOverlap[QuantumType.OTHER] / quantumCountA
    }
  };
}