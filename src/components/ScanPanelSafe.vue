<template>
  <div>
    <div v-if="!reschedule">
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
            <button class="btn btn-outline-secondary disabled mr-3" data-toggle="modal" :data-target="`#modal-rejection-${ scan.id }`">
              <font-awesome-icon icon="pencil-alt"></font-awesome-icon> {{ $t('home.scan.result.ignore-fix') }}
            </button>
            <button class="btn btn-outline-secondary disabled" @click="setReschedule">
              <font-awesome-icon icon="clock"></font-awesome-icon> {{ $t('home.scan.result.reschedule-scan') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <scan-panel-scheduler v-if="reschedule" :scan="scan" :scan-api-client="scanApiClient"></scan-panel-scheduler>
  </div>
</template>

<script>
import ScanPanelScheduler from './ScanPanelScheduler.vue';

export default {
  name: 'ScanPanelSafe',
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
  data() {
    return {
      reschedule: false,
    };
  },
  components: {
    ScanPanelScheduler,
  },
  methods: {
    setReschedule: async function setReschedule() {
      this.reschedule = true;
    },
  },
};
</script>
