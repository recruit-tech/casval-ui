<template>
  <div class="container pt-2rem">
    <div class="row">
      <div class="col align-items-center">
        <div class="card">
          <div class="card-header">
            <span><b><a :name="scan.scan_id">{{ scan.target }}</a></b></span>
            <span class="float-right">
              <button type="button" class="close" @click="deleteScan"><span>&times;</span></button>
            </span>
          </div>
          <div class="card-body">
            <p class="card-text text-primary" v-if="scan.calculatedState==='unscheduled'">
              <font-awesome-icon icon="calendar-minus"></font-awesome-icon> 検査を予約してください。
            </p>
            <p class="card-text text-secondary" v-else-if="scan.calculatedState==='scheduled'">
              <font-awesome-icon icon="calendar"></font-awesome-icon> 検査が行われるまでお待ちください。
            </p>
            <p class="card-text text-primary" v-else-if="scan.calculatedState==='failure'">
              <font-awesome-icon icon="calendar-times"></font-awesome-icon> 検査に失敗しました。再予約してください。
            </p>
            <p class="card-text text-success" v-else-if="scan.calculatedState==='safe'">
              <font-awesome-icon icon="check-circle"></font-awesome-icon> 修正を要する脆弱性はありません。
            </p>
            <p class="card-text text-danger" v-else-if="scan.calculatedState==='unsafe'">
              <font-awesome-icon icon="exclamation-circle"></font-awesome-icon> 脆弱性が検出されています。
            </p>
            <p class="card-text text-secondary" v-else>
              <font-awesome-icon icon="spinner" pulse></font-awesome-icon> スキャン情報を読み込み中です。
            </p>
          </div>
          <hr class="my-0">
          <div class="card-body">ToDo
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
