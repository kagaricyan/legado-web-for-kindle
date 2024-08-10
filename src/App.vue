<template>
  <RouterView/>
</template>

<script setup lang="ts">
document.addEventListener('dblclick', function (event) {
  event.preventDefault();
  event.stopPropagation();
}, true);
document.addEventListener('scroll', function (event) {
  event.preventDefault();
  event.stopPropagation();
}, {
  capture: true,
  passive: false,
});
document.addEventListener('wheel', function (event) {
  event.preventDefault();
  event.stopPropagation();
}, {
  capture: true,
  passive: false,
});
document.addEventListener('touchmove', function (event) {
  event.preventDefault();
  event.stopPropagation();
}, {
  capture: true,
  passive: false,
});

</script>


<style scoped>

</style>