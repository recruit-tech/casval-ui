<template>
  <form @submit.prevent="addTarget">
    <div class="form-row">
      <div class="col">
        <div class="d-flex flex-row">
          <div class="mr-auto w-100 pr-3">
            <input type="text" class="form-control" v-model="target" :placeholder="$t('home.target-form.ip-address-or-host-name')">
          </div>
          <div>
            <button class="btn w-100 btn-primary">{{ $t('home.target-form.register-target') }}</button>
          </div>
        </div>
        <small class="form-text text-danger">{{ errorMessage }}</small>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'TargetForm',
  props: {
    audit: {
      type: Object,
      required: true,
    },
    scanApiClient: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      target: '',
      errorMessage: '',
    };
  },
  methods: {
    addTarget: async function addTarget() {
      try {
        const res = await this.scanApiClient.post(null, { target: this.target, audit: { uuid: this.audit.uuid } });
        switch (res.status) {
          case 200:
          case 304:
            this.target = '';
            this.errorMessage = '';
            window.eventBus.$emit('SCAN_REGISTERED', res.data.id);
            break;
          case 400:
            console.log(res);
            this.errorMessage = this.$i18n.t(`home.target-form.status.${res.data.error_reason}`);
            break;
          case 401:
            this.errorMessage = this.$i18n.t('home.target-form.status.invalid-token');
            break;
          default:
            this.errorMessage = this.$i18n.t('home.target-form.status.unknown-error');
        }
      } catch (e) {
        this.errorMessage = this.$i18n.t('home.target-form.status.unknown-error');
      }
    },
  },
};
</script>
