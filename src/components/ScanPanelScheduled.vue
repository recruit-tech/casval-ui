<template>
  <div>
    <div class="py-1">
      <small class="text-secondary">
        <font-awesome-icon icon="calendar" class="mr-1"></font-awesome-icon>
        {{ schedule }}
      </small>
    </div>
    <div class="pt-3">
      <div class="form-row">
        <div class="col text-right">
          <button class="
          btn btn-secondary" @click="deleteScanSchedule">
            {{ $t('home.scan.schedule.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'ScanPanelScheduled',
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
  methods: {
    deleteScanSchedule: async function deleteScanSchedule() {
      try {
        const res = await this.scanApiClient.delete(`${this.scan.id}/schedule`);
        switch (res.status) {
          case 200: {
            window.eventBus.$emit('SCAN_UPDATED', this.scan.id);
            break;
          }
          default: {
            this.errorMessage = this.$i18n.t('home.scan.schedule.error-deletion');
          }
        }
      } catch (e) {
        this.errorMessage = this.$i18n.t('home.scan.schedule.error-deletion');
      }
    },
  },
  computed: {
    schedule: function getSchedule() {
      moment.locale(this.$i18n.locale);
      const utcOffset = moment().utcOffset();
      let start = moment(this.scan.schedule.start_at, 'YYYY-MM-DD hh:mm:ss').add(utcOffset, 'minutes');
      start = start.format(this.$i18n.t('home.scan.datetime.date-hour'));
      let end = moment(this.scan.schedule.end_at, 'YYYY-MM-DD hh:mm:ss').add(utcOffset, 'minutes');
      end = end.format(this.$i18n.t('home.scan.datetime.date-hour'));
      return this.$i18n.t('home.scan.schedule.scan-schedule', { start, end });
    },
  },
};
</script>
