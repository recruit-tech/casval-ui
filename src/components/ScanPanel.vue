<template>
  <div class="container pt-2rem">
    <div class="row">
      <div class="col align-items-center">
        <div class="card" :class="cardBorderClass">
          <div class="card-header bg-white">
            <span><b><a :name="scan.scan_id">{{ scan.target }}</a></b></span>
            <span class="float-right">
              <button type="button" class="close" @click="deleteScan"><span>&times;</span></button>
            </span>
          </div>
          <div class="card-header bg-white">
            <p class="card-text text-primary" v-if="scan.calculatedState==='unscheduled'">
              {{ $t('home.scan.status.unscheduled') }}
            </p>
            <p class="card-text text-secondary" v-else-if="scan.calculatedState==='scheduled'">
              {{ $t('home.scan.status.scheduled') }}
            </p>
            <p class="card-text text-danger" v-else-if="scan.calculatedState==='failure'">
              <font-awesome-icon icon="calendar-times"></font-awesome-icon> {{ $t('home.scan.status.failure') }}
            </p>
            <p class="card-text text-success" v-else-if="scan.calculatedState==='safe'">
              <font-awesome-icon icon="check-circle"></font-awesome-icon> {{ $t('home.scan.status.safe') }}
            </p>
            <p class="card-text text-danger" v-else-if="scan.calculatedState==='unsafe'">
              <font-awesome-icon icon="exclamation-circle"></font-awesome-icon> {{ $t('home.scan.status.unsafe') }}
            </p>
            <p class="card-text text-secondary" v-else>
              <font-awesome-icon icon="spinner" pulse></font-awesome-icon> {{ $t('home.scan.status.loading') }}
            </p>
          </div>
          <div class="card-body">
            <scan-panel-unscheduled v-if="scan.calculatedState==='unscheduled'" :scan="scan" :scan-api-client="scanApiClient"></scan-panel-unscheduled>
            <scan-panel-scheduled v-if="scan.calculatedState==='scheduled'" :scan="scan" :scan-api-client="scanApiClient"></scan-panel-scheduled>
            <scan-panel-unscheduled v-if="scan.calculatedState==='failure'" :scan="scan" :scan-api-client="scanApiClient"></scan-panel-unscheduled>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScanPanelUnscheduled from './ScanPanelUnscheduled.vue';
import ScanPanelScheduled from './ScanPanelScheduled.vue';

export default {
  name: 'ScanPanel',
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
  computed: {
    cardBorderClass: function cardBorderClass() {
      return {
        'border-primary': this.scan.calculatedState === 'unscheduled',
        'border-danger': this.scan.calculatedState === 'failure',
      };
    },
  },
  components: {
    ScanPanelUnscheduled,
    ScanPanelScheduled,
  },
  methods: {
    deleteScan: async function deleteScan() {
      try {
        const res = await this.scanApiClient.delete(this.scan.id);
        switch (res.status) {
          case 204:
            window.eventBus.$emit('SCAN_DELETED', this.scan.id);
            break;
          default:
            console.error(`Scan Deletion Failure: scanId=${this.scan.id}, status=${res.status}`);
        }
      } catch (e) {
        console.error(`Loading Failure: scanId=${this.scan.id}, exception=${e.message}`);
      }
    },
  },
};
</script>
