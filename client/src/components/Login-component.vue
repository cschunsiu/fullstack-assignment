<template>
  <div/>
  <div :class="contentClass">
    <input type="text" v-model="username" placeholder="Your username"/>
    <w-button bg-color="primary" shadow class="lg2" text xl width="100" :height="50" @click="onClickLogin">Login</w-button>
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
      username: ''
    }
  },
  methods: {
    async onClickLogin() {
      if (isEmpty(this.username)) {
        this.$emit('response', { message: 'Please enter a valid username'});
      } else {
        let polishedResult = await loginRequest(this.username);
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
</style>