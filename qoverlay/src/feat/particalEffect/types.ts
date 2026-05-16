import type { CatmullRomCurve3, Vector3 } from "three"


export type FlowNodeType =
  | 'human'
  | 'grass'
  | 'tree'
  | 'cloud'
  | 'custom'

export interface FlowNode {
  id: string
  type: FlowNodeType
  position: Vector3

  // 行为参数
  absorbRadius?: number
  emitDelay?: number

  // 可扩展视觉
  userData?: Record<string, any>
}

export interface FlowSegment {
  from: FlowNode
  to: FlowNode
  curve: CatmullRomCurve3
}