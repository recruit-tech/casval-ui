<template>
  <div>
    <div class="pb-1 text-dark" v-if="scan.calculatedState === 'unsafe'">
      <small v-for="result in scan.results" :key="result.id">
        <span v-if="result.fix_required">
          <font-awesome-icon icon="exclamation-circle" class="mr-2"></font-awesome-icon>
          {{ result.name }} ({{result.protocol}}/{{result.port}})<br>
        </span>
      </small>
      <hr class="mb-2">
    </div>
    <div class="py-1">
      <small class="text-primary">
        <font-awesome-icon icon="download" class="mr-2"></font-awesome-icon>
        <a :href="scan['report_url']" target="_blank">{{ $t('home.scan.result.download') }}</a>
      </small>
      <small v-if="scan.comment">
        <br><font-awesome-icon icon="pencil-alt" class="mr-2"></font-awesome-icon>{{ scan.comment }}
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
