<template>
  <div
    class="modal fade"
    tabindex="-1"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    aria-labelledby="deleteAcl"
    aria-hidden="true"
    ref="modal"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content pt-0">
        <div class="modal-header text-bg-secondary p-3 mb-2">
          <h5 class="modal-title text-primary">
            <i18n-t keypath="deleteAnAcl" tag="span" scope="global">
              <span class="text-white"> {{ vm.aclTenantName }} </span>
              <span class="text-white"> {{ vm.aclOwner }} </span>
            </i18n-t>
          </h5>
        </div>
        <div class="modal-body">
          <div class="row mt-3" v-if="!vm?.aclsError">
            <i18n-t keypath="confirmAclDeletion" tag="span" scope="global">
              <span class="fw-bold"> {{ vm.aclTenantName }} </span>
              <span class="text-danger fw-bold"> {{ vm.aclOwner }} </span>

              <p class="fw-bold">{{ $t('irreversibleAction') }}</p>
            </i18n-t>
          </div>
          <div class="row">
            <div
              v-if="vm?.aclsError"
              class="mt-2 ml-2 text-error fw-bold"
              aria-label="labels error"
              data-testid="aclOwnerError"
            >
              {{ $t(vm?.aclsError) }}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            :disabled="vm.deletingAcl"
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="$emit('cancel')"
          >
            <span role="cancel">{{ $t('cancel') }}</span>
          </button>
          <button
            v-if="!vm?.aclsError"
            :disabled="vm.deletingAcl || !vm.canDeleteAcl"
            id="confirmDelete"
            class="btn btn-primary"
            @click="actionDelete()"
          >
            <span
              v-if="vm.deletingAcl"
              id="spinner"
              class="spinner-border spinner-border-sm me-2"
            ></span>

            <span role="delete">{{ $t('delete') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { inject, onMounted, ref, type PropType } from 'vue'
import { I18nT } from 'vue-i18n'
import { Modal } from 'boosted'
import { Acl, AclOwnerTypes, RoleTypes } from '@mood/domain'
import { DeleteAclController, Alerter } from '@mood/web-adapters'
import { DELETE_ACL_CONTROLLER_FACTORY, ALERT } from '@/DependencyInjection'
import { UUID } from 'crypto'

export default {
  setup() {
    const modal = ref<HTMLElement | null>(null)
    let modalInstance: Modal | null = null
    const controller = inject(DELETE_ACL_CONTROLLER_FACTORY)?.build() as DeleteAclController
    const vm = ref(controller.vm)
    const alert = inject(ALERT) as Alerter

    onMounted(() => {
      controller.subscribeVM((updatedVm) => {
        vm.value = { ...updatedVm }
        vm.value.aclDeleted = false
        if (vm.value.displayAlert && vm.value.alert) {
          alert.triggerAlert(vm.value.alert)
          updatedVm.displayAlert = false
          vm.value = { ...updatedVm }
        }
      })
      if (modal.value) {
        modalInstance = new Modal(modal.value)
      }
    })

    const showModal = () => {
      modalInstance ? modalInstance.show() : console.error('The modal has not been initialized.')
    }

    const hideModal = () => {
      modalInstance ? modalInstance.hide() : console.error('The modal has not been initialized.')
    }
    return {
      vm,
      validateAclId(input: UUID) {
        if (input) controller.validateAclId(input)
      },
      validateAclOwner(input: string) {
        if (input) controller.validateAclOwner(input)
      },
      validateAclOwnerType(input: AclOwnerTypes) {
        if (input) controller.validateAclOwnerType(input)
      },
      validateAclRole(input: RoleTypes) {
        if (input) controller.validateAclRole(input)
      },
      validateAclTenantId(input: UUID) {
        if (input) controller.validateAclTenantId(input)
      },
      validateAclTenantName(input: string) {
        if (input) controller.validateAclTenantName(input)
      },
      validateAcls(input: Acl[]) {
        if (input) controller.validateAcls(input)
      },
      deleteAcl() {
        controller.delete()
      },
      modal,
      showModal,
      hideModal
    }
  },
  data: () => ({
    tenantId: '' as UUID
  }),
  components: {
    'i18n-t': I18nT
  },
  props: {
    acl: {
      type: Object as PropType<Acl>
    },
    acls: {
      type: Array<Acl>
    }
  },
  name: 'DeleteAcl',
  computed: {
    aclDeleted() {
      return this.vm.aclDeleted
    }
  },
  methods: {
    async actionDelete() {
      try {
        this.deleteAcl()
      } catch (error: Error | any) {
        console.error('error :', error)
      }
    },
    setAclTenantId(tenantId: UUID) {
      this.tenantId = tenantId
    }
  },
  watch: {
    acl(newAcl: Acl) {
      this.validateAclId(newAcl.id)
      this.validateAclOwner(newAcl.owner)
      this.validateAclOwnerType(newAcl.ownerType)
      this.validateAclRole(newAcl.role)
      this.validateAclTenantName(newAcl.tenantName)
    },
    acls(acls: Acl[]) {
      if (this.vm.acls?.length !== acls.length) {
        this.validateAcls(acls)
      }
    },
    aclDeleted() {
      if (this.vm.aclDeleted) {
        this.hideModal()
        this.vm.aclDeleted = false
        this.$emit('acl-deleted')
      }
    },
    tenantId(newTenantId) {
      this.validateAclTenantId(newTenantId)
    }
  }
}
</script>
