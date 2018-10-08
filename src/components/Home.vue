<template>
  <div>
    <div id="header" class="container-fluid px-0 pb-0">
      <div class="container-fluid pt-3 pb-3">
        <div class="row">
          <div class="col">
            <img src="../assets/logo-grey.svg" class="logo">
          </div>
          <div class="col text-right">
            <div class="dropdown">
              <button class="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown">
                <font-awesome-icon icon="bars"></font-awesome-icon>
              </button>
              <div class="dropdown-menu dropdown-menu-right">
                <button class="dropdown-item" type="button" @click="downloadAudit" v-if="auditDownloadable">
                  {{ $t('home.modal.download-audit') }}
                </button>
                <a href="#" class="dropdown-item" data-toggle="modal" data-target="#modal-contacts">{{ $t('home.modal.change-contact') }}</a>
                <a href="#" class="dropdown-item" data-toggle="modal" data-target="#modal-restriction">{{ $t('home.modal.restrict-access') }}</a>
                <a href="#" class="dropdown-item" data-toggle="modal" data-target="#modal-revocation">{{ $t('home.modal.revoke-page') }}</a>
                <div class="dropdown-divider"></div>
                <a :href="adminContacts" class="dropdown-item">{{ $t('home.modal.contact-admin') }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container pt-2 pb-5">
        <div class="row">
          <div class="col">
            <p class="h4 text-secondary mb-3"><b>{{ audit.name }}</b></p>
            <target-form :audit="audit" :scan-api-client="scanApiClient"></target-form>
          </div>
        </div>
      </div>
      <audit-status-bar :audit="audit" :audit-api-client="auditApiClient" :audit-status="auditStatus"></audit-status-bar>
    </div>
    <div v-for="scanUUID in scanOrder" :key="scanUUID">
      <scan-panel :scan="scans[scanUUID]" :scan-api-client="scanApiClient"></scan-panel>
    </div>
    <div class="pt-3 pb-3"></div>
    <modal-contacts :audit="audit" :audit-api-client="auditApiClient"></modal-contacts>
    <modal-access-restriction :audit="audit" :audit-api-client="auditApiClient"></modal-access-restriction>
    <modal-revocation :audit-api-client="auditApiClient"></modal-revocation>
  </div>
</template>

<script>
import Vue from 'vue';
import AuditStatusBar from './AuditStatusBar.vue';
import ModalAccessRestriction from './ModalAccessRestriction.vue';
import ModalContacts from './ModalContacts.vue';
import ModalRevocation from './ModalRevocation.vue';
import ScanPanel from './ScanPanel.vue';
import TargetForm from './TargetForm.vue';

function getScanStatus(scan) {
  if (scan.status.scheduled === true) {
    return 'scheduled';
  } else if (scan.status.scheduled === false && scan.status.processed === false) {
    return 'unscheduled';
  } else if (scan.status.scheduled === false && scan.status.processed === true) {
    if (scan.error_reason.length > 0) {
      return 'failure';
    }
    if (scan.results.length === 0) {
      return 'completed';
    }
    if (scan.results.some(result => result.fix_required) && scan.comment.length > 0) {
      return 'completed';
    }
    return 'unsafe';
  }
  return 'unknown-state';
}

export default {
  name: 'Home',
  props: {
    audit: {
      type: Object,
      required: true,
    },
    auditApiClient: {
      type: Function,
      required: true,
    },
    scanApiClient: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      adminContacts: process.env.VUE_APP_ADMIN_CONTACTS,
      scans: {},
      scanOrder: [],
    };
  },
  methods: {
    downloadAudit: async function downloadAudit() {
      try {
        const res = await this.auditApiClient.get('/download');
        switch (res.status) {
          case 200: {
            const csv = res.data;
            const mime = 'text/csv';
            const filename = `casval-audit-result-${this.audit.uuid}.csv`;
            const blob = new Blob([csv], { type: mime });
            if (window.navigator.msSaveBlob) {
              window.navigator.msSaveBlob(blob, filename); // IE
            } else if (window.URL && window.URL.createObjectURL) {
              const a = document.createElement('a');
              a.href = window.URL.createObjectURL(blob);
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }
            break;
          }
          default:
            alert(this.$i18n.t('home.modal.error-download'));
        }
      } catch (e) {
        alert(this.$i18n.t('home.modal.error-download'));
      }
    },
  },
  components: {
    AuditStatusBar,
    ModalAccessRestriction,
    ModalContacts,
    ModalRevocation,
    ScanPanel,
    TargetForm,
  },
  computed: {
    auditDownloadable: function auditDownloadable() {
      return Object.keys(this.scans).some((scanUUID) => {
        if (this.scans[scanUUID].status && this.scans[scanUUID].status.processed) {
          return true;
        }
        return false;
      });
    },
    auditStatus: function auditStatus() {
      if (this.audit.submitted) {
        return 'submitted';
      }
      if (Object.keys(this.scans).length === 0) {
        return 'ongoing';
      }
      // eslint-disable-next-line consistent-return
      let status = 'submit-ready';
      Object.keys(this.scans).some((scanUUID) => {
        const state = this.scans[scanUUID].calculatedState;
        if (state === 'unsafe') {
          status = 'fatal';
          return true;
        } else if (state !== 'completed') {
          status = 'ongoing';
          return true;
        }
        return false;
      });
      return status;
    },
  },
  created: function created() {
    window.eventBus.$on('AUDIT_UPDATED', async (data) => {
      Object.keys(data).forEach((key) => {
        // todo
        console.log(key);
      });
    });
    window.eventBus.$on('SCAN_REGISTERED', async (scanUUID) => {
      this.scanOrder.unshift(scanUUID);
      Vue.set(this.scans, scanUUID, { uuid: scanUUID, target: '', calculatedState: 'loading' });
      window.eventBus.$emit('SCAN_UPDATED', scanUUID);
    });
    window.eventBus.$on('SCAN_UPDATED', async (scanUUID) => {
      try {
        const res = await this.scanApiClient.get(scanUUID);
        switch (res.status) {
          case 200: {
            const scan = res.data;
            scan.calculatedState = getScanStatus(scan);
            Vue.set(this.scans, scanUUID, scan);
            break;
          }
          default: {
            console.error(`Loading Failure: scanUUID=${scanUUID}, status=${res.status}`);
            break;
          }
        }
      } catch (e) {
        console.error(`Loading Failure: scanUUID=${scanUUID}, exception=${e.message}`);
      }
    });
    window.eventBus.$on('SCAN_DELETED', async (scanUUID) => {
      const index = this.scanOrder.indexOf(scanUUID);
      Vue.delete(this.scanOrder, index);
      Vue.delete(this.scans, scanUUID);
    });
    this.audit.scans.forEach((scanUUID) => {
      window.eventBus.$emit('SCAN_REGISTERED', scanUUID);
    });
  },
};
</script>

<style scoped>
img.logo {
  height: 1.0rem;
}
#header {
  background-color: #ffffff;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  border-color: #d7d7d7;
}
#result {
  background-color: #ffffff;
  border-width: 1px 0px 0px 0px;
  border-style: solid;
  border-color: #d7d7d7;
}
</style>
