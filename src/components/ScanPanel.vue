<template>
  <div class="container pt-2rem">
    <div class="row">
      <div class="col align-items-center">
        <div class="card" :class="cardBorderClass">
          <div class="card-header bg-white">
            <span><b><a :name="scan.uuid">{{ scan.target }}</a></b></span>
            <span class="float-right">
              <button type="button" class="close" @click="deleteScan"><span>&times;</span></button>
            </span>
          </div>
          <div class="card-header bg-white">
            <p class="card-text text-warning" v-if="scan.calculatedState==='unscheduled' && warningAws">
              <font-awesome-icon icon="exclamation-circle"></font-awesome-icon> {{ $t('home.scan.status.warning-aws') }}
            </p>
            <p class="card-text text-primary" v-else-if="scan.calculatedState==='unscheduled'">
              {{ $t('home.scan.status.unscheduled') }}
            </p>
            <p class="card-text text-secondary" v-else-if="scan.calculatedState==='scheduled'">
              {{ $t('home.scan.status.scheduled') }}
            </p>
            <p class="card-text text-danger" v-else-if="scan.calculatedState==='failure'">
              <font-awesome-icon icon="calendar-times"></font-awesome-icon> {{ $t('home.scan.status.failure') }}
            </p>
            <p class="card-text text-secondary" v-else-if="scan.calculatedState==='completed'">
              <font-awesome-icon icon="check-circle"></font-awesome-icon> {{ $t('home.scan.status.completed') }}
            </p>
            <p class="card-text text-danger" v-else-if="scan.calculatedState==='unsafe'">
              <font-awesome-icon icon="exclamation-circle"></font-awesome-icon> {{ $t('home.scan.status.unsafe') }}
            </p>
            <p class="card-text text-secondary" v-else>
              <font-awesome-icon icon="spinner" pulse></font-awesome-icon> {{ $t('home.scan.status.loading') }}
            </p>
          </div>
          <div class="card-body">
            <scan-panel-comment v-if="requireComment" :scan="scan" :scan-api-client="scanApiClient">
            </scan-panel-comment>
            <scan-panel-scheduled v-else-if="scan.calculatedState==='scheduled'" :scan="scan" :scan-api-client="scanApiClient">
            </scan-panel-scheduled>
            <scan-panel-warning-aws v-else-if="scan.calculatedState==='unscheduled' && warningAws">
            </scan-panel-warning-aws>
            <scan-panel-scheduler v-else-if="scan.calculatedState==='unscheduled' || scan.calculatedState==='failure' || requireReschedule" :scan="scan" :scan-api-client="scanApiClient">
            </scan-panel-scheduler>
            <scan-panel-result v-else-if="scan.calculatedState==='completed' || scan.calculatedState==='unsafe'" :scan="scan" :scan-api-client="scanApiClient">
            </scan-panel-result>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScanPanelComment from './ScanPanelComment.vue';
import ScanPanelResult from './ScanPanelResult.vue';
import ScanPanelScheduled from './ScanPanelScheduled.vue';
import ScanPanelScheduler from './ScanPanelScheduler.vue';
import ScanPanelWarningAws from './ScanPanelWarningAws.vue';

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
  data() {
    return {
      requireComment: false,
      requireReschedule: false,
      acceptWarningAws: false,
    };
  },
  computed: {
    warningAws: function isWarningAws() {
      return this.scan.platform === 'aws' && !this.acceptWarningAws;
    },
    cardBorderClass: function cardBorderClass() {
      return {
        'border-primary': this.scan.calculatedState === 'unscheduled' && !this.warningAws,
        'border-warning': this.scan.calculatedState === 'unscheduled' && this.warningAws,
        'border-danger': this.scan.calculatedState === 'failure' || this.scan.calculatedState === 'unsafe',
      };
    },
  },
  components: {
    ScanPanelComment,
    ScanPanelResult,
    ScanPanelScheduled,
    ScanPanelScheduler,
    ScanPanelWarningAws,
  },
  methods: {
    deleteScan: async function deleteScan() {
      try {
        const res = await this.scanApiClient.delete(this.scan.uuid);
        switch (res.status) {
          case 200:
            window.eventBus.$emit('SCAN_DELETED', this.scan.uuid);
            break;
          default:
            console.error(`Scan Deletion Failure: scanId=${this.scan.uuid}, status=${res.status}`);
        }
      } catch (e) {
        console.error(`Loading Failure: scanId=${this.scan.uuid}, exception=${e.message}`);
      }
    },
  },
};
</script>

<style scoped>
.pt-2rem {
  padding-top: 2rem;
}
</style>
