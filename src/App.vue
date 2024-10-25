<template>
  <v-app>
    <!-- Router tarafından hangi sayfa (bileşen) yüklenecekse burada görüntülenir -->
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: 'App', // Ana bileşenin adı
};
</script>

<style>
/* İsteğe bağlı stiller buraya eklenebilir */
</style>
