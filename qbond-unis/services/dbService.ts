// 数据库服务 - 使用uni.storage

interface Person {
  id: string;
  name: string;
  location: string;
  weight: number | null;
  height: number | null;
  age: number | null;
}

class DbService {
  private personsKey: string = 'qbond_persons';
  private isInitialized: boolean = false;

  async init(): Promise<void> {
    if (this.isInitialized) {
      return;
    }
    try {
      const persons = await this.getAllPersons();
      console.log('Database initialized successfully, persons count:', persons.length);
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  async getAllPersons(): Promise<Person[]> {
    try {
      const data = uni.getStorageSync(this.personsKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get all persons:', error);
      return [];
    }
  }

  async addPerson(person: Omit<Person, 'id'>): Promise<Person> {
    try {
      const persons = await this.getAllPersons();
      const id = `person_${Date.now()}`;
      const newPerson: Person = { id, ...person };
      persons.push(newPerson);
      uni.setStorageSync(this.personsKey, JSON.stringify(persons));
      return newPerson;
    } catch (error) {
      console.error('Failed to add person:', error);
      throw error;
    }
  }

  async updatePerson(person: Person): Promise<Person> {
    try {
      const persons = await this.getAllPersons();
      const index = persons.findIndex(p => p.id === person.id);
      if (index !== -1) {
        persons[index] = person;
        uni.setStorageSync(this.personsKey, JSON.stringify(persons));
        return person;
      }
      throw new Error('Person not found');
    } catch (error) {
      console.error('Failed to update person:', error);
      throw error;
    }
  }

  async deletePerson(id: string): Promise<void> {
    try {
      const persons = await this.getAllPersons();
      const filteredPersons = persons.filter(p => p.id !== id);
      uni.setStorageSync(this.personsKey, JSON.stringify(filteredPersons));
    } catch (error) {
      console.error('Failed to delete person:', error);
      throw error;
    }
  }

  async getPersonById(id: string): Promise<Person | null> {
    try {
      const persons = await this.getAllPersons();
      return persons.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Failed to get person by id:', error);
      return null;
    }
  }
}

const dbService = new DbService();

export default dbService;
export type { Person };
