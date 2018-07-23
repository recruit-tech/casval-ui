<template>
  <div id="result" class="container-fluid pt-3 pb-3" v-if="auditStatus !== ''">
    <div class="row">
      <div class="col text-center" v-if="auditStatus === 'ready'">
        <span class="text-primary pr-2">
          {{ $t('home.audit-status-bar.submit-ready') }}
        </span>
        <button class="btn btn-primary" @click="submit">
          {{ $t('home.audit-status-bar.submit') }}
        </button>
      </div>
      <div class="col text-center" v-if="auditStatus === 'submitted'">
        <span class="text-dark pr-2">
          {{ $t('home.audit-status-bar.submit-completed') }}
        </span>
        <button class="btn btn-dark" @click="cancel">
          {{ $t('home.audit-status-bar.withdrawal') }}
        </button>
      </div>
      <div class="col text-center" v-if="auditStatus === 'error'">
        <span class="text-danger">
          <font-awesome-icon icon="check-circle" class="mr-1"></font-awesome-icon>
          <b>{{ $t('home.audit-status-bar.vulnerability-found') }}</b>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuditStatusBar',
  props: {
    audit: {
      type: Object,
      required: true,
    },
    auditApiClient: {
      type: Function,
      required: true,
    },
    auditStatus: {
      type: String,
      required: true,
    },
  },
  methods: {
    submit: async function submit() {
      try {
        const res = await this.auditApiClient.post(`${this.audit.id}/submit`);
        switch (res.status) {
          case 200:
            this.errorMessage = '';
            this.auditStatus = 'submitted';
            break;
          default:
            this.errorMessage = this.$i18n.t('home.audit-status-bar.submission-failure');
        }
      } catch (e) {
        this.errorMessage = this.$i18n.t('home.audit-status-bar.submission-failure');
      }
    },
    cancel: async function cancel() {
      try {
        console.log('cancel!');
        const res = await this.auditApiClient.delete(`${this.audit.id}/submit`);
        switch (res.status) {
          case 200:
            this.errorMessage = '';
            this.auditStatus = 'ready';
            break;
          default:
            this.errorMessage = this.$i18n.t('home.audit-status-bar.withdrawal-failure');
        }
      } catch (e) {
        this.errorMessage = this.$i18n.t('home.audit-status-bar.withdrawal-failure');
      }
    },
  },
};
</script>
