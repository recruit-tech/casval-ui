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
    <div v-for="scanId in scanOrder" :key="scanId">
      <scan-panel :scan="scans[scanId]" :scan-api-client="scanApiClient"></scan-panel>
    </div>
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
  // Debug
  if (this !== null) {
    return 'safe';
  }

  if (scan.status.scheduled === true) {
    return 'scheduled';
  } else if (scan.status.scheduled === false && scan.status.processed === false) {
    return 'unscheduled';
  } else if (scan.status.scheduled === false && scan.status.processed === true) {
    if (scan.error_reason.length > 0) {
      return 'failure';
    }
    if (scan.results.some(result => result.fix_required) || scan.comment.length > 0) {
      return 'safe';
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
  components: {
    AuditStatusBar,
    ModalAccessRestriction,
    ModalContacts,
    ModalRevocation,
    ScanPanel,
    TargetForm,
  },
  computed: {
    auditStatus: function auditStatus() {
      if (this.audit.submitted) {
        return 'submitted';
      }
      if (this.scans.length > 0) {
        // eslint-disable-next-line consistent-return
        this.scans.forEach((scan) => {
          if (scan.calculatedState === 'unsafe') {
            return 'fatal';
          }
          if (scan.calculatedState !== 'safe') {
            return 'ongoing';
          }
        });
      } else {
        return 'ongoing';
      }
      return 'submit-ready';
    },
  },
  created: function created() {
    window.eventBus.$on('AUDIT_UPDATED', async (data) => {
      Object.keys(data).forEach((key) => {
        // todo
        console.log(key);
      });
    });
    window.eventBus.$on('SCAN_REGISTERED', async (scanId) => {
      this.scanOrder.unshift(scanId);
      Vue.set(this.scans, scanId, { id: scanId, target: '', calculatedState: 'loading' });
      window.eventBus.$emit('SCAN_UPDATED', scanId);
    });
    window.eventBus.$on('SCAN_UPDATED', async (scanId) => {
      try {
        const res = await this.scanApiClient.get(scanId);
        switch (res.status) {
          case 200: {
            const scan = res.data;
            scan.calculatedState = getScanStatus(scan);
            Vue.set(this.scans, scanId, scan);
            break;
          }
          default: {
            console.error(`Loading Failure: scanId=${scanId}, status=${res.status}`);
            break;
          }
        }
      } catch (e) {
        console.error(`Loading Failure: scanId=${scanId}, exception=${e.message}`);
      }
    });
    window.eventBus.$on('SCAN_DELETED', async (scanId) => {
      const index = this.audit.scans.indexOf(scanId);
      Vue.delete(this.scanOrder, index);
      Vue.delete(this.scans, scanId);
    });
    this.audit.scans.forEach((scanId) => {
      window.eventBus.$emit('SCAN_REGISTERED', scanId);
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
