<template>
    <div class="route-progress" :class="{ 'route-progress--pending': isPending }" aria-hidden="true" />
</template>

<script setup lang="ts">
import useRoutePending from "@/app/composable/useRoutePending";

const { isPending } = useRoutePending();
</script>
