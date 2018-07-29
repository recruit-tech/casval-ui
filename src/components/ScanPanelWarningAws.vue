<template>
  <div>
    <div class="py-1">
      <small class="text-dark" v-html="$t('home.scan.schedule.aws-warning-message', { ip: sourceIpAddress })"></small>
    </div>
    <div class="pt-3">
      <div class="form-row">
        <div class="col text-right">
          <button type="button" class="btn btn-warning" @click="acceptWarning">
            <font-awesome-icon icon="check-circle"></font-awesome-icon> {{ $t('home.scan.schedule.aws-warning-ok') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScanPanelWarningAws',
  data() {
    return {
      sourceIpAddress: process.env.VUE_APP_SOURCE_IP_ADDRESS,
    };
  },
  methods: {
    acceptWarning: function acceptWarning() {
      this.$parent.acceptWarningAws = true;
    },
  },
};
</script>
