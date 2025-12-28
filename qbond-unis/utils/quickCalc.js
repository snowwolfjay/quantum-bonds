// 速算版本算法实现

const QUANTUM_COEFFICIENT = 1.0e6;
const DIRECT_EXCHANGE_COEFFICIENT = 1.0e-4;
const INDIRECT_EXCHANGE_COEFFICIENT = 5.0e-5;
const TRANSITION_EXCHANGE_COEFFICIENT = 1.0e-6;

function calculateDistance(coord1, coord2) {
  const R = 6371e3;
  const φ1 = (coord1.lat * Math.PI) / 180;
  const φ2 = (coord2.lat * Math.PI) / 180;
  const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const Δλ = ((coord2.lon - coord1.lon) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function calculateQuantumCount(weight, height) {
  return weight * height * QUANTUM_COEFFICIENT;
}

function calculateSymbiosisTime(minimumAge) {
  return minimumAge * 365 * 24 * 60;
}

function calculateAverageDistance(distance) {
  return distance;
}

function estimateMinuteExchangeRate(quantumCount) {
  return quantumCount * 1.0e-9;
}

function calculateDirectExchange(quantumExchangeRate, distance) {
  const distanceFactor = 1.0 / (1.0 + distance / 1000.0);
  return DIRECT_EXCHANGE_COEFFICIENT * quantumExchangeRate * distanceFactor;
}

function calculateIndirectExchange(quantumExchangeRate) {
  return INDIRECT_EXCHANGE_COEFFICIENT * quantumExchangeRate;
}

function calculateTransitionExchange(quantumExchangeRate, distance) {
  const distanceFactor = distance / 1000.0;
  return TRANSITION_EXCHANGE_COEFFICIENT * quantumExchangeRate * distanceFactor;
}

export function calculateQuickQuantumOverlap(params) {
  const quantumCountA = calculateQuantumCount(params.personA.weight, params.personA.height);
  const quantumCountB = calculateQuantumCount(params.personB.weight, params.personB.height);

  const symbiosisTime = calculateSymbiosisTime(params.minimumAge);

  const distance = calculateDistance(params.personA.location, params.personB.location);
  const averageDistance = calculateAverageDistance(distance);

  const quantumExchangeRateA = estimateMinuteExchangeRate(quantumCountA);
  const quantumExchangeRateB = estimateMinuteExchangeRate(quantumCountB);

  const directExchangeAtoB = calculateDirectExchange(quantumExchangeRateA, averageDistance);
  const indirectExchangeAtoB = calculateIndirectExchange(quantumExchangeRateA);
  const transitionExchangeAtoB = calculateTransitionExchange(quantumExchangeRateA, averageDistance);

  const directExchangeBtoA = calculateDirectExchange(quantumExchangeRateB, averageDistance);
  const indirectExchangeBtoA = calculateIndirectExchange(quantumExchangeRateB);
  const transitionExchangeBtoA = calculateTransitionExchange(quantumExchangeRateB, averageDistance);

  const totalExchangePerMinute = (
    directExchangeAtoB + indirectExchangeAtoB + transitionExchangeAtoB +
    directExchangeBtoA + indirectExchangeBtoA + transitionExchangeBtoA
  ) / 2;

  const totalOverlap = totalExchangePerMinute * symbiosisTime;

  return totalOverlap;
}
