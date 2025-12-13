// 初始化服务
import { Person } from './dbService';

// 初始化状态接口
interface InitState {
  isLoading: boolean;
  isFirstUse: boolean;
  isInitialized: boolean;
}

// 初始化服务类
export class InitService {
  private dbService: any;
  private initState: InitState;

  constructor(dbService: any) {
    this.dbService = dbService;
    this.initState = {
      isLoading: true,
      isFirstUse: false,
      isInitialized: false
    };
  }

  // 检查是否为首次使用
  async checkFirstUse(): Promise<boolean> {
    try {
      // 使用localStorage替代@capacitor/preference
      const firstUseTime = localStorage.getItem('firstUseTime');
      if (!firstUseTime) {
        // 首次使用，但不立即记录时间，等待用户成功录入信息后再记录
        this.initState.isFirstUse = true;
        return true;
      }
      this.initState.isFirstUse = false;
      return false;
    } catch (error) {
      console.error('Error checking first use:', error);
      // 出错时默认不是首次使用
      this.initState.isFirstUse = false;
      return false;
    }
  }

  // 设置首次使用时间
  setFirstUseTime(): void {
    try {
      localStorage.setItem('firstUseTime', Date.now().toString());
      this.initState.isFirstUse = false;
    } catch (error) {
      console.error('Error setting first use time:', error);
    }
  }

  // 执行数据库初始化
  async initDatabase(): Promise<void> {
    try {
      this.initState.isLoading = true;
      // 初始化数据库（如果尚未初始化）
      await this.dbService.init();
      this.initState.isLoading = false;
      this.initState.isInitialized = true;
    } catch (error) {
      console.error('Error initializing database:', error);
      this.initState.isLoading = false;
      throw error;
    }
  }

  // 保存初始用户信息
  async saveInitialUser(userData: Omit<Person, 'id'>): Promise<void> {
    try {
      // 设置用户ID为"me"
      await this.dbService.updatePerson({
        id: 'me',
        ...userData
      });
    } catch (error) {
      console.error('Error saving initial user:', error);
      throw error;
    }
  }

  // 获取初始化状态
  getInitState(): InitState {
    return this.initState;
  }
}

// 导出初始化服务实例
export let initService: InitService;

// 初始化服务工厂函数
export const createInitService = (dbService: any) => {
  initService = new InitService(dbService);
  return initService;
};
