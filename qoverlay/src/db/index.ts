// RxDB 数据库配置
import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

// 定义人员数据模型
const personSchema = {
  version: 1,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    name: {
      type: 'string'
    },
    location: {
      type: 'string'
    },
    weight: {
      type: ['number', 'null']
    },
    height: {
      type: ['number', 'null']
    },
    age: {
      type: ['number', 'null']
    }
  },
  required: ['id', 'name']
};

// 初始化数据库
export async function initDatabase() {
  // 创建数据库
  const db = await createRxDatabase({
    name: 'quantum-overlap-db',
    storage: getRxStorageDexie()
  });

  // 创建集合
  await db.addCollections({
    persons: {
      schema: personSchema
    }
  });

  return db;
}

// 导出类型
export type PersonDocType = {
  id: string;
  name: string;
  location: string;
  weight: number | null;
  height: number | null;
  age: number | null;
};

export type QuantumDatabase = Awaited<ReturnType<typeof initDatabase>>;
