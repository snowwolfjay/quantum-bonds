// 数据库服务 - 使用Vue的provide/inject机制
import { createRxDatabase, addRxPlugin, RxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
import { provide, inject, InjectionKey, onUnmounted } from 'vue';

// 添加必要的插件
addRxPlugin(RxDBMigrationSchemaPlugin);

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

// 定义人员数据类型
export interface Person {
  id: string;
  name: string;
  location: string;
  weight: number | null;
  height: number | null;
  age: number | null;
}

// 数据库服务类
export class DbService {
  private db: RxDatabase | null = null;
  private isInitialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;

  // 公共构造函数
  constructor() { }


  // 初始化数据库
  public async init(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.initializeDatabase();
    return this.initializationPromise;
  }

  // 实际初始化数据库的方法
  private async initializeDatabase(): Promise<void> {
    try {
      // 创建数据库
      this.db = await createRxDatabase({
        name: 'quantum-overlap-db',
        storage: getRxStorageDexie()
      });

      // 创建集合
      await this.db.addCollections({
        persons: {
          schema: personSchema
        }
      });

      this.isInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  // 获取数据库实例
  public async getDb(): Promise<any> {
    if (!this.isInitialized) {
      await this.init();
    }
    return this.db;
  }

  // 获取人员集合
  public async getPersonsCollection(): Promise<any> {
    const db = await this.getDb();
    return db.persons;
  }

  // 获取所有人员
  public async getAllPersons(): Promise<Person[]> {
    const collection = await this.getPersonsCollection();
    const docs = await collection.find().exec();
    return docs.map((doc: any) => doc.toJSON());
  }

  // 添加人员
  public async addPerson(person: Omit<Person, 'id'>): Promise<Person> {
    const collection = await this.getPersonsCollection();
    // 使用时间戳作为主要标识符，简化ID结构
    const id = `person_${Date.now()}`;
    const doc = await collection.insert({ id, ...person });
    return doc.toJSON();
  }

  // 更新人员
  public async updatePerson(person: Person): Promise<Person> {
    const collection = await this.getPersonsCollection();
    const doc = await collection.upsert(person);
    return doc.toJSON();
  }

  // 删除人员
  public async deletePerson(id: string): Promise<void> {
    const collection = await this.getPersonsCollection();
    await collection.remove(id);
  }

  // 监听人员变化
  public async watchPersons(callback: (persons: Person[]) => void): Promise<() => void> {
    const collection = await this.getPersonsCollection();
    const subscription = collection.find().$.subscribe(async () => {
      const persons = await this.getAllPersons();
      callback(persons);
    });

    // 返回取消订阅的函数
    return () => {
      subscription.unsubscribe();
    };
  }

  destroyDbService() {
    this.db?.close();
    console.log('Database closed successfully');
  }

  
}

// 创建注入键
export const DB_SERVICE_KEY: InjectionKey<DbService> = Symbol('dbService');

// 提供数据库服务的函数
export function provideDbService() {
  const dbService = new DbService();
  provide(DB_SERVICE_KEY, dbService);
  onUnmounted(() => {
    dbService.destroyDbService();
  });
  return dbService;
}

// 注入数据库服务的函数
export function injectDbService(): DbService {
  const dbService = inject(DB_SERVICE_KEY);
  if (!dbService) {
    throw new Error('DbService not provided');
  }
  return dbService;
}

