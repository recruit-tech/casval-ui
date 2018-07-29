<template>
  <div>
    <div class="row mb-3" v-if="scan.error_reason.length > 0">
      <div class="col">
        <small class="text-danger">{{ errorMessage }}</small>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <small class="text-secondary">{{ $t('home.scan.schedule.start-datetime') }}</small>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <select class="form-control form-control-sm" v-model="startDate">
          <option value="" selected>{{ $t('home.scan.schedule.date-unspecified') }}</option>
          <option v-for="(canditate, key) in startDateCandidates" :value="canditate.value" :key="key">
            {{ canditate.name }}
          </option>
        </select>
      </div>
      <div class="col" v-if="startDate.length > 0">
        <select class="form-control form-control-sm" v-model="startTime">
          <option value="" selected>{{ $t('home.scan.schedule.time-unspecified') }}</option>
          <option v-for="(canditate, key) in startTimeCandidates" :value="canditate.value" :key="key">
            {{ canditate.name }}
          </option>
        </select>
      </div>
      <div class="col-6"></div>
    </div>
    <div class="row pt-3">
      <div class="col">
        <small class="text-secondary">{{ $t('home.scan.schedule.expiration-datetime') }}</small>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <select class="form-control form-control-sm" v-model="endDate">
          <option value="" selected>{{ $t('home.scan.schedule.date-unspecified') }}</option>
          <option v-for="(canditate, key) in endDateCandidates" :value="canditate.value" :key="key">
            {{ canditate.name }}
          </option>
        </select>
      </div>
      <div class="col" v-if="endDate.length > 0">
        <select class="form-control form-control-sm" v-model="endTime">
          <option value="" selected>{{ $t('home.scan.schedule.time-unspecified') }}</option>
          <option v-for="(canditate, key) in endTimeCandidates" :value="canditate.value" :key="key">
            {{ canditate.name }}
          </option>
        </select>
      </div>
      <div class="col-6"></div>
    </div>
    <div class="row mt-4">
      <div class="col text-right">
        <button v-if="this.$parent.requireReschedule" class="btn btn-outline-secondary mr-3" @click="cancelReschedule">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>
          {{ $t('home.scan.schedule.return') }}
        </button>
        <button class="btn btn-primary" @click="setSchedule"><font-awesome-icon icon="clock"></font-awesome-icon> {{ $t('home.scan.schedule.schedule-scan') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'ScanPanelScheduler',
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
      currentTime: null,
      errorMessage: this.scan.error_reason,
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    };
  },
  methods: {
    cancelReschedule: async function cancelReschedule() {
      this.$parent.requireReschedule = false;
    },
    setSchedule: async function setSchedule() {
      let registerStartDate = this.startDate;
      if (registerStartDate.length === 0) {
        registerStartDate = this.startDateCandidates[0].value;
      }
      let registerStartTime = this.startTime;
      if (registerStartTime.length === 0) {
        registerStartTime = this.startTimeCandidates[0].value;
      }
      let registerEndDate = this.endDate;
      if (registerEndDate.length === 0) {
        registerEndDate = this.endDateCandidates[this.endDateCandidates.length - 1].value;
      }
      let registerEndTime = this.endTime;
      if (registerEndTime.length === 0) {
        registerEndTime = this.endTimeCandidates[this.endTimeCandidates.length - 1].value;
      }
      const utcOffset = moment().utcOffset();
      const startAt = moment(`${registerStartDate} ${registerStartTime}`, 'YYYY-MM-DD HH-mm-ss').subtract(utcOffset, 'minutes');
      const endAt = moment(`${registerEndDate} ${registerEndTime}`, 'YYYY-MM-DD HH-mm-ss').subtract(utcOffset, 'minutes');

      try {
        const res = await this.scanApiClient.patch(`${this.scan.id}/schedule`, {
          schedule: { start_at: startAt.format('YYYY-MM-DDTHH-mm-ss'), end_at: endAt.format('YYYY-MM-DDTHH-mm-ss') },
        });
        switch (res.status) {
          case 200: {
            this.errorMessage = '';
            this.$parent.requireReschedule = false;
            window.eventBus.$emit('SCAN_UPDATED', this.scan.id);
            break;
          }
          default: {
            this.errorMessage = this.$i18n.t('home.scan.schedule.error-general');
          }
        }
      } catch (e) {
        this.errorMessage = this.$i18n.t('home.scan.schedule.error-general');
      }
    },
  },
  computed: {
    earliestStartDateTime: function getEarliestStartDateTime() {
      // The estimated earliest start date time is used when start date is not specified by user
      return this.currentTime.clone().add(65, 'minutes').minutes(0).seconds(0);
    },
    earliestEndDateTime: function getEarliestEndDateTime() {
      if (this.startDate === '') {
        // If start date is not specified by user,
        // then the estimated end date is after 2 hours from the earliest start time
        return this.earliestStartDateTime.clone().add(2, 'hours');
      }

      let estimatedStartTime = this.startTime;
      if (estimatedStartTime.length === 0) {
        // When start time is not specified by user
        if (this.startDate === this.earliestStartDateTime.format('YYYY-MM-DD')) {
          // If start date specified by user is same as the ealiest start date,
          // then use the estimated earliest start time.
          estimatedStartTime = this.earliestStartDateTime.format('HH:00:00');
        } else {
          // If start date is future date, then use 00:00:00.
          estimatedStartTime = '00:00:00';
        }
      }
      // The ealiest end date time is after 2 hours from the specified start date time.
      return moment(`${this.startDate} ${estimatedStartTime}`, 'YYYY-MM-DD HH-mm-ss').add(2, 'hours');
    },
    startDateCandidates: function getStartDateCandidates() {
      const candidates = [];
      const m = this.earliestStartDateTime.clone();
      const format = this.$i18n.t('home.scan.datetime.date');
      for (let i = 0; i < 14; i += 1) {
        candidates.push({ value: m.format('YYYY-MM-DD'), name: m.format(format) });
        m.add(1, 'day');
      }
      return candidates;
    },
    endDateCandidates: function getEndDateCandidates() {
      const candidates = [];
      const m = this.earliestEndDateTime.clone();
      const format = this.$i18n.t('home.scan.datetime.date');
      for (let i = 0; i < 7; i += 1) {
        candidates.push({ value: m.format('YYYY-MM-DD'), name: m.format(format) });
        m.add(1, 'day');
      }
      return candidates;
    },
    startTimeCandidates: function getStartTimeCandidates() {
      const candidates = [];
      let hour = 0;
      if (this.startDate.length === 0 || this.startDate === this.earliestStartDateTime.format('YYYY-MM-DD')) {
        // If start date specified by user is the same date as the earliest start date,
        // then the candidate hour is started from the earliest start time.
        hour = this.earliestStartDateTime.hour();
      }

      while (hour < 24) {
        candidates.push({ value: `${hour}:00:00`, name: this.$i18n.t('home.scan.datetime.time', { hour }) });
        hour += 1;
      }
      return candidates;
    },
    endTimeCandidates: function getEndTimeCandidates() {
      const candidates = [];
      let hour = 0;
      if (this.endDate === this.earliestEndDateTime.format('YYYY-MM-DD')) {
        // If end date specified by user is the same date as the earliest end date,
        // then the candidate hour is started from the earliest end time.
        hour = this.earliestEndDateTime.hour();
      }
      while (hour < 24) {
        candidates.push({ value: `${hour}:00:00`, name: this.$i18n.t('home.scan.datetime.time', { hour }) });
        hour += 1;
      }
      return candidates;
    },
  },
  created: function created() {
    moment.locale(this.$i18n.locale);
    this.currentTime = moment();
    setInterval(() => { this.currentTime = moment(); }, 1000 * 30); // Update every 30 seconds.
  },
};
</script>