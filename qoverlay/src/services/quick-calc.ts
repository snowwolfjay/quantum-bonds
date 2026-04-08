import { C } from "vue-router/dist/router-CWoNjPRp.mjs";

/**
 * 量子重叠计算器模块
 */
const CONSTANTS = {
    DT: 10,   // 亲密接触每日交换量 (g)
    NA: 6.02214076e23,      // 阿伏伽德罗常数
    VM: 24.5,               // 常温常压气体摩尔体积 (L/mol)
    V_ATMO: 4.0e21,         // 对流层总体积 (L)
    AVG_MOLAR_MASS: 110.0,  // 人体生物大分子平均摩尔质量 (g/mol)
    SKIN_DAILY_SHED: 1.5,   // 每天皮肤脱落质量 (g)
    BREATH_VOL: 0.5,        // 单次呼吸体积 (L)
    BREATH_RATE: 28800 ,     // 每日呼吸次数 (20次/分 * 1440分)
    Q_PER_KG: 4e25
};

/**
 * 子函数 1: 呼吸/大气交换模型 (全球尺度)
 * 参考文献: 《凯撒的最后一口气》(Sam Kean) 的概率统计模型
 */
function calcBreathOverlap(years: number) {
    const totalAtomsInAtmo = (CONSTANTS.V_ATMO / CONSTANTS.VM) * CONSTANTS.NA;
    const totalAtomsBreathedA = CONSTANTS.BREATH_RATE * 365 * years * (CONSTANTS.BREATH_VOL / CONSTANTS.VM) * CONSTANTS.NA;
    const totalAtomsBreathedB = totalAtomsBreathedA; // 假设B的呼吸量一致

    // 概率模型：A释放的粒子在总量中的占比，乘以B摄入的总量
    return (totalAtomsBreathedA * totalAtomsBreathedB) / totalAtomsInAtmo;
}

/**
 * 子函数 2: 环境粉尘与对流模型 (局部尺度)
 * 参考文献: Weschler (2015) 室内化学与人体脱落物研究
 */
function calcDustOverlap(years: number, distance: number) {
    if (distance > 10) return 0; // 超过10km基本只靠大气循环，粉尘忽略不计

    const totalShedAtoms = (CONSTANTS.SKIN_DAILY_SHED * 365 * years / CONSTANTS.AVG_MOLAR_MASS) * CONSTANTS.NA;
    // 扩散效率系数: 使用平方反比定律模拟，1km处效率极低
    const efficiency = 1 / (Math.pow(distance * 1000 + 1, 2));
    const captureRate = 0.001; // 假设B摄入或接触到A粉尘的比例为千分之一

    return totalShedAtoms * efficiency * captureRate;
}

/**
 * 子函数 3: 接触转移模型 (微观尺度)
 * 参考文献: 罗卡交换定律 (Locard's Exchange Principle)
 */
function calcContactOverlap(years: number, isClose: boolean) {
    if (!isClose) return 0;

    // 假设密切接触者（如家人、伴侣）每天产生 0.01g 的直接物质转移（汗液、皮脂等）
    const dailyTransferMass = CONSTANTS.DT; // g
    const totalTransferAtoms = (dailyTransferMass * 365 * years / CONSTANTS.AVG_MOLAR_MASS) * CONSTANTS.NA;

    return totalTransferAtoms;
}

/**
 * 总整合函数: 计算最终量子重叠数量
 */
export function calculateTotalOverlap(ageMin: number, distanceKm: number) {
    const isClose = distanceKm < 0.1 // 小于1米视为密切接触

    const n1 = calcBreathOverlap(ageMin);
    const n2 = calcDustOverlap(ageMin, distanceKm);
    const n3 = calcContactOverlap(ageMin, isClose);

    return {
        total: n1 + n2 + n3,
        components: {
            breath: n1,
            dust: n2,
            contact: n3
        },
        formatted: (n1 + n2 + n3).toExponential(4) // 科学计数法格式化
    };
}

export function estimateTotalQuantum(weightKg: number, ) {
    return weightKg * CONSTANTS.Q_PER_KG;
}
