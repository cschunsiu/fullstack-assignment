<template>
  <div/>
  <div :class="contentClass">
    <input type="text" v-model="username" placeholder="Your username"/>
    <div :class="interactionClass">
      <w-button bg-color="primary" shadow class="lg2" text xl width="100" :height="50" @click="onClick('sign-Up')">Sign Up</w-button>
      <w-button bg-color="primary" shadow class="lg2" text xl width="100" :height="50" @click="onClick('sign-In')">Sign In</w-button>
    </div>
  </div>
  <div/>
</template>

<script>
import {loginRequest} from '@/service/api-service'
import { isEmpty } from 'lodash';

export default {
  name: "Login-component",
  data() {
    return {
      contentClass: 'content',
      interactionClass: 'interaction',
      username: ''
    }
  },
  methods: {
    async onClick(type) {
      if (isEmpty(this.username)) {
        this.$emit('response', { message: 'Please enter a valid username'});
      } else {
        let polishedResult = await loginRequest(this.username, type);
        this.$emit('response', polishedResult);
      }
    }
  }
}
</script>

<style scoped>
div {
  flex: 3;
}
.content {
  flex: 8;
  color: black;
  background-color: white;
  justify-content: space-evenly;
  flex-direction: column;
  height: 30%;
  padding: 15px;
}
.interaction {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
}
</style>