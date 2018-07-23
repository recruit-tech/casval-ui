<template>
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
</template>

<script>
import AuditStatusBar from './AuditStatusBar.vue';
import TargetForm from './TargetForm.vue';

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
      auditStatus: '',
    };
  },
  components: {
    AuditStatusBar,
    TargetForm,
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

<style>
select.form-control:focus {
  box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0), 0 0 8px rgba(0, 0, 0, 0);
  border-width: 2px;
}

.pt-2rem {
  padding-top: 2rem;
}

.padding-quarter {
  padding-left: 0.25rem;
}

.input-contacts {
  border-left-width: 0px;
  border-right-width: 0px;
  border-top-width: 0px;
  border-bottom-width: 1px;
}

.result-icon {
  width: 1.5rem !important;
  min-width: 1.5rem;
  padding-bottom: 1rem;
}
</style>
