<script setup lang="ts">
/** Short points beside a split block's text: how backups work, or how the vault is protected. */
import { computed } from 'vue';
import { useHome } from './useHome';

const props = defineProps<{ of: 'backup' | 'security' }>();
const home = useHome();
const items = computed(() => home.value[props.of].items);
</script>

<template>
  <div class="lk-plate lk-points">
    <dl class="lk-points-list">
      <div v-for="item in items" :key="item.title" class="lk-point">
        <dt>{{ item.title }}</dt>
        <dd>{{ item.body }}</dd>
      </div>
    </dl>
  </div>
</template>
