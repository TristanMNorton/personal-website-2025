<template>
  <header class="mainNav">
    <h1 class="title">
      Tristan Norton
    </h1>
  </header>
</template>

<style>
.container {
  margin: 0 auto;
  display: flex;
  text-align: left;
}

.mainNav {
  display: flex;
  align-items: flex-end;
  column-gap: 2rem;
  padding: 2rem;
}

.title {
  display: block;
  font-weight: 300;
  font-size: 3rem;
  color: var(--text-color);
  letter-spacing: 1px;
  margin: 0;
  line-height: 1;
  transition: color var(--theme-transition-time) var(--easing);
}

.link {
  display: block;
  font-weight: 300;
  font-size: 1.25rem;
  color: var(--text-color);
  word-spacing: 5px;
  text-decoration: none;
  line-height: 1;
  transition: color var(--theme-transition-time) var(--easing);
  transform: translateY(-5px);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

.list {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
</style>
