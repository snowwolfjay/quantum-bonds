// 初始化服务

import dbService from './dbService';

interface PersonData {
  name: string;
  location: string;
  weight: number | null;
  height: number | null;
  age: number | null;
}

interface InitState {
  isLoading: boolean;
  isFirstUse: boolean;
  isInitialized: boolean;
}

class InitService {
  private dbService: any;
  private initState: InitState = {
    isLoading: true,
    isFirstUse: false,
    isInitialized: false
  };

  constructor(dbServiceInstance: any) {
    this.dbService = dbServiceInstance;
  }

  async checkFirstUse(): Promise<boolean> {
    try {
      const firstUseTime = uni.getStorageSync('firstUseTime');
      if (!firstUseTime) {
        this.initState.isFirstUse = true;
        return true;
      }
      this.initState.isFirstUse = false;
      return false;
    } catch (error) {
      console.error('Error checking first use:', error);
      this.initState.isFirstUse = false;
      return false;
    }
  }

  setFirstUseTime(): void {
    try {
      uni.setStorageSync('firstUseTime', Date.now().toString());
      this.initState.isFirstUse = false;
    } catch (error) {
      console.error('Error setting first use time:', error);
    }
  }

  async initDatabase(): Promise<void> {
    try {
      this.initState.isLoading = true;
      await this.dbService.init();
      this.initState.isLoading = false;
      this.initState.isInitialized = true;
    } catch (error) {
      console.error('Error initializing database:', error);
      this.initState.isLoading = false;
      throw error;
    }
  }

  async saveInitialUser(userData: PersonData): Promise<void> {
    try {
      await this.dbService.updatePerson({
        id: 'me',
        ...userData
      });
    } catch (error) {
      console.error('Error saving initial user:', error);
      throw error;
    }
  }

  getInitState(): InitState {
    return this.initState;
  }
}

export default InitService;
export type { PersonData, InitState };
