<template>
  <div :class="headerClass">
    <h1>Face Detect App</h1>
    <w-button v-if="isLogin" bg-color="primary" shadow class="lg2" text xl width="100" :height="50" @click="signOut">Sign out</w-button>
  </div>
  <div :class="contentClass">
    <LoginComponent v-if="!isLogin" @response="(result) => processLoginResult(result)"/>
    <InteractionComponent v-else :info="profileModel" @response="(result) => processError(result)"/>
  </div>
  <w-overlay
      v-model="showOverlay"
      bg-color="rgba(29,30,35, 0.8)">
    <div>{{errorMessage}}</div>
    <w-button
        bg-color="rgba(69,139,249)"
        lg
        dark
        @click="showOverlay = false">
      <w-icon class="mr2">wi-cross</w-icon>
      Close
    </w-button>
  </w-overlay>
</template>

<script>
import { isNil } from 'lodash';
import LoginComponent from './components/Login-component.vue'
import InteractionComponent from "@/components/Interaction-component.vue";

export default {
  name: 'App',
  data() {
    return {
      showOverlay: false,
      headerClass: 'header',
      contentClass: 'content',
      profileModel: {},
      errorMessage: '',
      isLogin: false
    }
  },
  components: {
    InteractionComponent,
    LoginComponent
  },
  methods: {
    processLoginResult(result) {
      if (result && !isNil(result.message)) {
        this.showOverlay = !this.showOverlay;
        this.errorMessage = result.message;
      } else {
        this.profileModel = result;
        this.isLogin = true;
      }
    },
    processError(result) {
      if (result && !isNil(result.message)) {
        this.showOverlay = !this.showOverlay;
        this.errorMessage = result.message;
      }
    },
    signOut(){
      this.profileModel = {};
      this.isLogin = false;
    }
  }
}
</script>

<style>
html, body {
  margin:0;
  padding:0;
  height:100%;
  width: 100%;
  display: flex;
  color: white;
}
#app {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.header {
  flex: 1;
  background-color: #333333;
  display: flex;
  align-items: center;
  padding-inline: 10px;
  justify-content: space-between;
}
.content {
  flex: 9;
  background-color: #6e6e6e;
  justify-content: center;
  align-items: center;
  display: flex;
}
.w-overlay {
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
}
</style>
