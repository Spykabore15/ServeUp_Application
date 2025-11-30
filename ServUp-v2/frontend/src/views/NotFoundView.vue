<template>
  <div class="not-found container text-center">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
    <router-link to="/dashboard" class="btn btn-primary">
      Back to Dashboard
    </router-link>
  </div>
</template>

<style scoped>
.not-found {
  padding: 4rem 2rem;
}

.not-found h1 {
  font-size: 6rem;
  color: #dc3545;
}
</style>

