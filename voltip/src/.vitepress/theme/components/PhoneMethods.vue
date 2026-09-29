<script setup lang="ts">
/** How a phone connects and what it can send. */
import { useHome } from './useHome';

const home = useHome();
</script>

<template>
  <div class="vt-plate vt-phone">
    <dl class="vt-phone-list">
      <div v-for="item in home.phone.items" :key="item.title" class="vt-phone-item">
        <dt>{{ item.title }}</dt>
        <dd>{{ item.body }}</dd>
      </div>
    </dl>
  </div>
</template>
