<template>
  <div>
    <div class="d-flex align-items-start flex-row">
      <div class="py-1">
        <small class="text-primary">
          <font-awesome-icon icon="download" class="mr-1"></font-awesome-icon>
          <a :href="scan['report_url']" target="_blank">{{ $t('home.scan.result.download-results') }}</a>
        </small>
      </div>
    </div>
    <div class="d-flex align-items-start flex-row" v-if="scan.comment">
      <div class="py-1">
        <small>{{ scan.comment }}</small>
      </div>
    </div>
    <div class="pt-3">
      <div class="form-row">
        <div class="col text-right">
          <button class="btn mr-3" :class="{ 'btn-outline-secondary': scan.calculatedState !=='unsafe', 'btn-secondary': scan.calculatedState ==='unsafe', 'disabled': scan.calculatedState !=='unsafe' }" @click="setComment">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon> {{ $t('home.scan.result.ignore-fix') }}
          </button>
          <button class="btn" :class="{ 'btn-outline-secondary': scan.calculatedState !=='unsafe', 'btn-primary': scan.calculatedState ==='unsafe', 'disabled': scan.calculatedState !=='unsafe' }" @click="setReschedule">
            <font-awesome-icon icon="clock"></font-awesome-icon> {{ $t('home.scan.result.reschedule-scan') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScanPanelScheduler from './ScanPanelScheduler.vue';

export default {
  name: 'ScanPanelResult',
  props: {
    scan: {
      type: Object,
      required: true,
    },
    scanApiClient: {
      type: Function,
      required: true,
    },
  },
  components: {
    ScanPanelScheduler,
  },
  methods: {
    setComment: async function setComment() {
      this.$parent.requireComment = true;
    },
    setReschedule: async function setReschedule() {
      this.$parent.requireReschedule = true;
    },
  },
};
</script>
