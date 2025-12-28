// 速算版本算法实现

interface Location {
  lat: number;
  lon: number;
}

interface Person {
  location: Location;
  weight: number;
  height: number;
}

interface QuickCalcParams {
  personA: Person;
  personB: Person;
  minimumAge: number;
}

const QUANTUM_COEFFICIENT = 1.0e6;
const DIRECT_EXCHANGE_COEFFICIENT = 1.0e-4;
const INDIRECT_EXCHANGE_COEFFICIENT = 5.0e-5;
const TRANSITION_EXCHANGE_COEFFICIENT = 1.0e-6;

function calculateDistance(coord1: Location, coord2: Location): number {
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

function calculateQuantumCount(weight: number, height: number): number {
  return weight * height * QUANTUM_COEFFICIENT;
}

function calculateSymbiosisTime(minimumAge: number): number {
  return minimumAge * 365 * 24 * 60;
}

function calculateAverageDistance(distance: number): number {
  return distance;
}

function estimateMinuteExchangeRate(quantumCount: number): number {
  return quantumCount * 1.0e-9;
}

function calculateDirectExchange(quantumExchangeRate: number, distance: number): number {
  const distanceFactor = 1.0 / (1.0 + distance / 1000.0);
  return DIRECT_EXCHANGE_COEFFICIENT * quantumExchangeRate * distanceFactor;
}

function calculateIndirectExchange(quantumExchangeRate: number): number {
  return INDIRECT_EXCHANGE_COEFFICIENT * quantumExchangeRate;
}

function calculateTransitionExchange(quantumExchangeRate: number, distance: number): number {
  const distanceFactor = distance / 1000.0;
  return TRANSITION_EXCHANGE_COEFFICIENT * quantumExchangeRate * distanceFactor;
}

export function calculateQuickQuantumOverlap(params: QuickCalcParams): number {
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

export type { Location, Person, QuickCalcParams };
