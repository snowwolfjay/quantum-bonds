// 精算版本算法实现

const QUANTUM_COEFFICIENT = 1.0e6;

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

function getTransmissionMethodProportions() {
  return {
    respiration: 0.35,
    evaporation: 0.25,
    thermalMotion: 0.20,
    externalForce: 0.15,
    quantumTransition: 0.05
  };
}

function getQuantumTypeProportionsByMethod() {
  return {
    respiration: {
      water: 0.60,
      oxygen: 0.35,
      other: 0.05
    },
    evaporation: {
      water: 0.95,
      oxygen: 0.03,
      other: 0.02
    },
    thermalMotion: {
      water: 0.40,
      oxygen: 0.30,
      other: 0.30
    },
    externalForce: {
      water: 0.50,
      oxygen: 0.20,
      other: 0.30
    },
    quantumTransition: {
      water: 0.30,
      oxygen: 0.30,
      other: 0.40
    }
  };
}

function calculateTransmissionArrivalRates(distance) {
  return {
    respiration: 1.0 / (1.0 + Math.pow(distance / 100, 2)),
    evaporation: 1.0 / (1.0 + Math.pow(distance / 500, 1.5)),
    thermalMotion: 1.0 / (1.0 + Math.pow(distance / 1000, 1.2)),
    externalForce: 1.0 / (1.0 + Math.pow(distance / 2000, 1.0)),
    quantumTransition: 0.5 * Math.exp(-distance / 10000)
  };
}

export function calculatePreciseQuantumOverlap(params) {
  const quantumCountA = calculateQuantumCount(params.personA.weight, params.personA.height);

  const symbiosisTime = calculateSymbiosisTime(params.minimumAge);

  const distance = calculateDistance(params.personA.location, params.personB.location);

  const transmissionMethodProportions = getTransmissionMethodProportions();

  const quantumTypeProportionsByMethod = getQuantumTypeProportionsByMethod();

  const transmissionArrivalRates = calculateTransmissionArrivalRates(distance);

  let totalOverlap = 0;
  const quantumTypeOverlap = {
    water: 0,
    oxygen: 0,
    other: 0
  };

  const methods = ['respiration', 'evaporation', 'thermalMotion', 'externalForce', 'quantumTransition'];
  const quantumTypes = ['water', 'oxygen', 'other'];

  for (const method of methods) {
    const methodProportion = transmissionMethodProportions[method];
    const arrivalRate = transmissionArrivalRates[method];

    for (const quantumType of quantumTypes) {
      const quantumTypeProportion = quantumTypeProportionsByMethod[method][quantumType];
      const quantumOverlap = quantumCountA * methodProportion * quantumTypeProportion * arrivalRate * 1.0e-9 * symbiosisTime;

      totalOverlap += quantumOverlap;
      quantumTypeOverlap[quantumType] += quantumOverlap;
    }
  }

  const overlapPercentage = totalOverlap / quantumCountA;

  return {
    overlapAmount: totalOverlap,
    overlapPercentage: overlapPercentage,
    transmissionRates: transmissionArrivalRates,
    quantumTypeRates: {
      water: quantumTypeOverlap.water / quantumCountA,
      oxygen: quantumTypeOverlap.oxygen / quantumCountA,
      other: quantumTypeOverlap.other / quantumCountA
    }
  };
}
