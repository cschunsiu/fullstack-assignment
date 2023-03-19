<template>
  <div/>
  <div :class="contentClass">
    <form :class="uploadClass" ref="form">
      <input type="file" accept="image/*" @change="fileUpload($event)">
      <span v-if="image.status" style="color: greenyellow">Success!</span>
      <input v-model="image.name" type="text" placeholder="add name">
      <w-button bg-color="primary" shadow class="lg2" text xl width="100" :height="25" @click="onCLickUpload">Upload</w-button>
    </form>
    <div :class="listClass">
      <w-table
          :headers="table.headers"
          :items="table.items">
        <template #item="{ item }">
          <tr>
            <td
                v-for="(header, i) in table.headers"
                :key="i"
                :class="`pa4 text-left`">
              <w-progress
                  v-if="header.key===`status`"
                  v-model="item[header.key]"
                  size="1.3em"
                  round
                  color="green"
                  label-color="black"
                  label>
              </w-progress>
              <div v-else-if="header.key==='data'" v-for="(key, index) in Object.keys(item[header.key])" :key="index">
                <div key="index">{{key}}: {{item[header.key][key]}}</div>
              </div>
              <span v-else>{{ item[header.key] || '' }}</span>
            </td>
          </tr>
        </template>
      </w-table>
    </div>
  </div>
  <div/>
</template>

<script>
import {uploadRequest} from '@/service/api-service'
import {cloneDeep} from 'lodash'

export default {
  name: "Interaction-component",
  props: {
    info: Object
  },
  data() {
    return {
      contentClass: 'content',
      uploadClass: 'upload',
      listClass: 'list',
      image: {
        file: null,
        name: '',
        status: false
      },
      tableItemTemplate: {
        name: '',
        status: 0,
        data: {}
      },
      table: {
        headers: [
          { label: 'Name', key: 'name', width: "20%" },
          { label: 'Status', key: 'status', width: "30%" },
          { label: 'Data', key: 'data', width: "50%" }
        ],
        items: []
      },
    }
  },
  methods: {
    async fileUpload(e){
      const reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.onload = e => {
        this.image.file = e.target.result;
        this.image.status = true;
      }
    },
    onCLickUpload() {
      const cloneTemp = cloneDeep(this.tableItemTemplate);
      cloneTemp.name = this.image.name;
      this.table.items.push(cloneTemp);
      const result = uploadRequest(this.info.username, this.image, this.updateProgress, this.table.items.length-1);
      this.$emit('response', result);
      this.reset();
    },
    updateProgress(percent, data = {}, position) {
      this.table.items[position].status = percent;
      this.table.items[position].data = data;
    },
    reset() {
      this.$refs.form.reset();
      this.image = {
        file: null,
        name: '',
        status: false
      };
      this.tableItemTemplate.name = '';
    }
  }
}
</script>

<style scoped>
div {
  flex: 1;
}
.content {
  flex: 8;
  color: black;
  background-color: white;
  flex-direction: column;
  height: 90%;
  padding: 15px;
  row-gap: 1rem;
}
.upload {
  flex: 1;
  border: 1px solid #333333;
  border-radius: 10px;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  width: 100%;
  padding-inline: 100px;
}
.list {
  flex: 9;
  width: 100%;
}
</style>