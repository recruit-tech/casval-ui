<template>
  <div>
    <div>
      <small class="text-secondary" v-for="result in scan.results" :key="result.id">
        <a :href="scan['report_url']">
          <font-awesome-icon icon="exclamation-circle" class="mr-2"></font-awesome-icon>{{ result.name }} - {{result.port}}
        </a><br>
      </small>
      <small v-if="scan.comment" class="text-secondary">
        <hr class="mb-3">
        <font-awesome-icon icon="pencil-alt" class="mr-2"></font-awesome-icon>{{ scan.comment }}
      </small>
    </div>
    <div class="pt-3">
      <div class="form-row">
        <div class="col text-right">
          <button class="btn mr-3" :class="{ 'btn-outline-secondary': scan.calculatedState !=='unsafe', 'btn-secondary': scan.calculatedState ==='unsafe', 'disabled': scan.calculatedState !=='unsafe' }" @click="setComment">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon> {{ $t('home.scan.result.ignore') }}
          </button>
          <button class="btn" :class="{ 'btn-outline-secondary': scan.calculatedState !=='unsafe', 'btn-primary': scan.calculatedState ==='unsafe', 'disabled': scan.calculatedState !=='unsafe' }" @click="setReschedule">
            <font-awesome-icon icon="clock"></font-awesome-icon> {{ $t('home.scan.result.reschedule') }}
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
    setComment: function setComment() {
      this.$parent.requireComment = true;
    },
    setReschedule: function setReschedule() {
      this.$parent.requireReschedule = true;
    },
  },
};
</script>
