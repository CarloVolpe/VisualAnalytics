<template>
  <div id="app">
    <Header @challenge-selected="setCurrentChallenge"/>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-10">

          <div v-if="!currentChallenge">

            <div class="content-wrapper">

              <h1>Challenge Overview</h1>
              <i>In Engagement, Ohio, the future is now! For years this sleepy bedroom community was a secret gem in the heart of the state. But now the word is out and the people are running, not walking, to buy up their claim on this bit of paradise!</i>
              <p class="empty-space">Anticipating rapid growth, the city of Engagement,
                Ohio USA is doing a participatory urban planning exercise to understand the current
                state of the city and identify opportunities for future growth. About 1000 representative
                residents in this modest-sized city have agreed to provide data using the city’s urban planning app,
                which records the places they visit, their spending, and their purchases, among other things.
                From these volunteers, the city will have data to assist with their major community revitalization efforts,
                including how to allocate a very large city renewal grant they have recently received. As a visual
                analytics expert, you have joined the city planning team to make sense of the data provided by
                these residents.</p>
            </div>


          <b-navbar toggleable="md" type="light" variant="light">
             <b-navbar-nav class="flex-column">
               <b-nav-item class="c1 nav-item" @click="setCurrentChallenge('Challenge1')">Question 1: Assuming the volunteers are representative of the city’s population, characterize the distinct areas of the city that you identify.</b-nav-item>
               <b-nav-item class="c2 nav-item" @click="setCurrentChallenge('Challenge2')">Question 2: Where are the busiest areas in Engagement? Are there traffic bottlenecks that should be addressed?</b-nav-item>
               <b-nav-item class="c3 nav-item" @click="setCurrentChallenge('Challenge3')">Question 3: Participants have given permission to have their daily routines captured. Choose two different participants with different routines and describe their daily patterns, with supporting evidence.</b-nav-item>
               <b-nav-item class="c4 nav-item" @click="setCurrentChallenge('Challenge4')">Question 4: Over the span of the dataset, how do patterns change in the city change? </b-nav-item>
             </b-navbar-nav>
          </b-navbar>

          </div>

          <component :is="currentChallenge"></component>
          



        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>


<script>


import Header from '@/components/Header.vue';

import Challenge1 from '@/components/Domanda_uno.vue';
import Challenge2 from "@/components/Domanda_due.vue";
import Challenge3 from '@/components/Domanda_tre.vue';
import Challenge4 from '@/components/Domanda_quattro.vue';

export default {
  name: 'App',
  components: {
    Header,
    Challenge1,
    Challenge2,
    Challenge3,
    Challenge4
  },
  data() {
    return {
      currentChallenge: '',
    };
  },

  methods: {


    
    setCurrentChallenge(challenge) {
      if (challenge === 'Home') {
        
        this.currentChallenge = ''; 
      } else {
        this.currentChallenge = challenge;
        this.$emit('challenge-selected', challenge);

      }
    },
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.empty-space {
  margin-top: 1em;
}

.container-fluid {
  margin-left: 1000px;
}

.content-wrapper {
  max-width: none;

}




i {
  display: inline-block;
  max-width: 2000px;
}

body {
  padding-bottom: 100px;
}

.c1, .c2, .c3, .c4 {
  border-radius: 10px; 
}

.c1:hover, .c2:hover, .c3:hover, .c4:hover {
  background-color: #fcbf49; 
  color: #333; 
}


</style>