<template>
  <div id="app" class="h-100">
    <entrance :status="status"></entrance>
  </div>
</template>

<script>
import axios from 'axios';
import Entrance from './components/Entrance.vue';

export default {
  name: 'app',
  data() {
    return {
      audit: null,
      status: 'loading',
      token: null,
    };
  },
  components: {
    Entrance,
  },
  computed: {
    auditApiClient: function createAuditApiClient() {
      return axios.create({
        baseURL: process.env.VUE_APP_AUDIT_API_ENDPOINT,
        timeout: process.env.VUE_APP_API_TIMEOUT,
        headers: { Authorization: `Bearer ${this.token}` },
        validateStatus: () => true,
      });
    },
  },
  methods: {
    generateToken: async function generateToken(auditId, password) {
      this.status = 'loading';
      try {
        const res = await this.auditApiClient.post(`${auditId}/tokens`, { password });
        switch (res.status) {
          case 201:
            this.token = res.data.token;
            this.getAudit(auditId);
            break;
          case 401:
            this.status = 'restricted-by-password';
            break;
          case 403:
            this.status = 'restricted-by-ip';
            break;
          case 404:
            this.status = 'not-found';
            break;
          default:
            this.status = 'unknown-error';
        }
      } catch (e) {
        this.status = 'unknown-error';
      }
    },
    getAudit: async function getAudit(auditId) {
      try {
        const res = await this.auditApiClient.get(auditId);
        switch (res.status) {
          case 200:
          case 304:
            this.status = 'loaded';
            this.audit = res.data;
            window.document.title = `${process.env.VUE_APP_TITLE} - ${this.audit.name}`;
            break;
          case 401:
            this.status = 'invalid-token';
            break;
          case 404:
            this.status = 'not-found';
            break;
          default:
            this.status = 'unknown-error';
        }
      } catch (e) {
        this.status = 'unknown-error';
      }
    },
  },
  created: function created() {
    window.eventBus.$on('INITIALIZE_TOKEN', (password) => {
      const auditId = window.location.hash.substring(2) || '';
      this.generateToken(auditId, password);
    });
  },
};
</script>

<style>
html {
  height: 100%;
}
body {
  height:100%;
}
</style>
