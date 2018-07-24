<template>
  <div id="modal-revocation" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('home.modal.revocation.title') }}</h5>
          <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
        </div>
        <div class="modal-body">
          <p>
            {{ $t('home.modal.revocation.message-1') }}<br>
            {{ $t('home.modal.revocation.message-2') }}<br>
            <small class="form-text text-danger">{{ errorMessage }}</small>
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">{{ $t('home.modal.revocation.cancel') }}</button>
          <button type="button" class="btn btn-danger" @click="revokeAudit">{{ $t('home.modal.revocation.ok') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap';

export default {
  name: 'ModalRevocation',
  props: {
    auditApiClient: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      errorMessage: '',
    };
  },
  methods: {
    revokeAudit: async function revokeAudit() {
      this.errorMessage = '';
      try {
        const res = await this.auditApiClient.delete();
        switch (res.status) {
          case 204: {
            window.location.reload(true);
            break;
          }
          default: {
            this.errorMessage = this.$i18n.t('home.modal.revocation.error');
          }
        }
      } catch (e) {
        this.errorMessage = this.$i18n.t('home.modal.revocation.error');
      }
    },
  },
};
</script>
