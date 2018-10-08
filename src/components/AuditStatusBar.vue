<template>
  <div class="container-fluid fixed-bottom pb-5" v-if="auditStatus !== 'ongoing'">
    <div class="row">
      <div class="col"></div>
      <div class="col10 text-center border border-primary shadow p-3 bg-white rounded" v-if="auditStatus === 'submit-ready'">
        <span class="text-primary pr-2">{{ $t('home.audit-status-bar.submit-ready') }}</span>
        <button class="btn btn-primary" @click="submit">
          <font-awesome-icon icon="chevron-circle-right"></font-awesome-icon>
          {{ $t('home.audit-status-bar.submit') }}
        </button>
      </div>
      <div class="col10 text-center border border-sedoncary shadow p-3 bg-white rounded" v-if="auditStatus === 'submitted'">
        <span class="text-secondary pr-2">{{ $t('home.audit-status-bar.submit-completed') }}</span>
        <button class="btn btn-secondary disabled" @click="cancel">
          <font-awesome-icon icon="chevron-circle-right"></font-awesome-icon>
          {{ $t('home.audit-status-bar.withdraw') }}
        </button>
      </div>
      <div class="col10 text-center border border-danger shadow p-3 bg-white rounded" v-if="auditStatus === 'fatal'">
        <span class="text-danger">
          <font-awesome-icon icon="check-circle" class="mr-1"></font-awesome-icon>
          {{ $t('home.audit-status-bar.critical-vulnerability-found') }}
        </span>
      </div>
      <div class="col"></div>
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
        const res = await this.auditApiClient.post('/submit');
        switch (res.status) {
          case 200:
            this.errorMessage = '';
            this.auditStatus = 'submitted';
            break;
          default:
            this.errorMessage = this.$i18n.t('home.audit-status-bar.submit-failure');
        }
      } catch (e) {
        this.errorMessage = this.$i18n.t('home.audit-status-bar.submit-failure');
      }
    },
    cancel: async function cancel() {
      try {
        if (window.confirm(this.$i18n.t('home.audit-status-bar.withdraw-confirmation'))) {
          const res = await this.auditApiClient.delete('/submit');
          switch (res.status) {
            case 200:
              this.errorMessage = '';
              this.auditStatus = 'submit-ready';
              break;
            default:
              this.errorMessage = this.$i18n.t('home.audit-status-bar.withdraw-failure');
          }
        }
      } catch (e) {
        this.errorMessage = this.$i18n.t('home.audit-status-bar.withdraw-failure');
      }
    },
  },
};
</script>
