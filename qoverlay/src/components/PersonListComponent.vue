<template>
  <div :class="['person-list-component', `${props.mode}-mode`]" :data-mode="props.mode">
    <ion-list>
      <ion-item
        v-for="p in persons"
        :key="p.id"
        @click="handleItemClick(p)"
        :class="['person-list-item', { 'selected-person': isSelectedPerson(p) }]"
      >
        <ion-avatar slot="start">
          <img
            :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || '?')}&background=random&color=fff&size=64`" />
        </ion-avatar>
        <ion-label>
          <h2>{{ p.name || t('计算页面.人员.未命名') }}</h2>
          <p>
            {{ p.age ? `${p.age} ${t('计算页面.人员.岁')}` : t('计算页面.人员.年龄未知') }}
            | {{ p.height ? `${p.height} cm` : t('计算页面.人员.身高未知') }}
            | {{ p.weight ? `${p.weight} kg` : t('计算页面.人员.体重未知') }}
          </p>
          <p class="location-info">{{ p.location || t('计算页面.人员.位置未知') }}</p>
        </ion-label>
      </ion-item>
    </ion-list>
  </div>
</template>

<script setup lang="ts">
import { IonAvatar, IonItem, IonLabel, IonList } from '@ionic/vue';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { injectDbService, Person } from '../services/dbService';
import { defaultPerson } from '../config/defaultPerson';

const { t } = useI18n();

const props = defineProps<{
  mode: 'select' | 'edit';
  selectedPerson?: Omit<Person, 'id'>;
}>();

const emit = defineEmits<{
  select: [Person];
}>();

const persons = ref<Person[]>([]);
const dbService = injectDbService();
let unsubscribeFromPersons: (() => void) | null = null;

const normalizePerson = (person: Omit<Person, 'id'> | Person) => ({
  name: person.name || '',
  location: person.location || '',
  weight: person.weight ?? null,
  height: person.height ?? null,
  age: person.age ?? null
});

const selectedPersonHash = computed(() => {
  if (!props.selectedPerson) {
    return null;
  }
  const normalized = normalizePerson(props.selectedPerson);
  return `${normalized.name}|${normalized.age}|${normalized.height}|${normalized.weight}|${normalized.location}`;
});

const isSelectedPerson = (person: Person) => {
  if (!selectedPersonHash.value) {
    return false;
  }
  const normalized = normalizePerson(person);
  const hash = `${normalized.name}|${normalized.age}|${normalized.height}|${normalized.weight}|${normalized.location}`;
  return hash === selectedPersonHash.value;
};

const initData = async () => {
  try {
    const dbPersons = await dbService.getAllPersons();
    persons.value = [defaultPerson, ...dbPersons.filter(person => person.id !== defaultPerson.id)];

    unsubscribeFromPersons = await dbService.watchPersons((newPersons) => {
      persons.value = [defaultPerson, ...newPersons.filter(person => person.id !== defaultPerson.id)];
    });
  } catch (error) {
    console.error('Failed to load persons:', error);
  }
};

const handleItemClick = (person: Person) => {
  emit('select', person);
};

onMounted(() => {
  initData();
});

onUnmounted(() => {
  if (unsubscribeFromPersons) {
    unsubscribeFromPersons();
    unsubscribeFromPersons = null;
  }
});
</script>

<style scoped>
.person-list-component {
  width: 100%;
}

.person-list-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 80px;
  margin-bottom: 10px;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.person-list-item:hover {
  --background: rgba(var(--ion-color-primary-rgb), 0.05);
}

.person-list-item.selected-person {
  background: rgba(var(--ion-color-primary-rgb), 0.14);
}

.person-list-item ion-label h2 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.location-info {
  font-size: 12px !important;
  color: var(--ion-color-medium) !important;
  margin-top: 2px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
