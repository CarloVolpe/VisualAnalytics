<template>
    <b-navbar toggleable="md" type="light" variant="light">
      <b-navbar-brand id="home" href="#" @click="setCurrentChallenge('')">VAST Challenge 2022</b-navbar-brand>
      <b-navbar-toggle target="navbarNav"></b-navbar-toggle>
    </b-navbar>
  </template>
  
  <script>
  export default {
    name: "PageHeader",
    methods: {
      setCurrentChallenge(challenge) {
        this.$emit('challenge-selected', challenge);
      },
    },
  };
  </script>
  
  <style scoped>
  
  nav {
    margin-bottom: 20px;
  }
  #home{
    color: black;
    font-weight: lighter;
  }
  /* Stile per i nav-item */
  .nav-item.nav-item {
    color: white;
    padding: 0.5rem 1rem;
    transition: opacity 0.3s;
  }
  .c2 {
    background-color: #0079FF;
    border-radius: 20px;
    margin-right: 10px;
  }
  .c3 {
    background-color: #FB8500;
    border-radius: 20px;
  }
  
  </style>