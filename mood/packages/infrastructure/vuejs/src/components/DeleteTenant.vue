<template>
  <div
    class="modal fade"
    tabindex="-1"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    aria-labelledby="deleteTenant"
    aria-hidden="true"
    ref="modal"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content pt-0">
        <div class="modal-header text-bg-secondary p-3 mb-4">
          <h5 class="modal-title text-primary">{{ $t('confirm') }}</h5>
        </div>
        <div class="modal-body">
          <div class="row mb-3">
            <i18n-t keypath="confirmTenantDeletion" tag="span" scope="global">
              <span class="text-danger fw-bold"> {{ tenantName }} </span>
              <span class="fw-bold">{{ $t('irreversibleAction') }}</span>
            </i18n-t>
          </div>

          <div class="col-md-12 mb-3">
            <label for="tenantNameField" class="form-label ml-1">
              {{ $t('confirmName') }} <span id="required">*</span>
            </label>
            <required-field
              id="tenantToDeleteField"
              maxLength="30"
              :field-value="vm?.tenantName"
              :borderError="`form-control ${vm?.tenantNameError ? 'border-danger' : ''}`"
              :lowercase="true"
              @update-value="validateTenantName($event)"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            :disabled="vm.deletingTenant"
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="$emit('cancel')"
          >
            <span role="cancel">{{ $t('cancel') }}</span>
          </button>
          <button
            :disabled="vm.deletingTenant || !vm.canDeleteTenant"
            id="confirmDelete"
            class="btn btn-primary"
            @click="actionDelete()"
          >
            <span
              v-if="vm.deletingTenant"
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
import { DeleteTenantController, Alerter } from '@mood/web-adapters'
import { DELETE_TENANT_CONTROLLER_FACTORY, ALERT } from '@/DependencyInjection'

import RequiredField from './RequiredField.vue'
import { UUID } from 'crypto'

export default {
  setup() {
    const modal = ref<HTMLElement | null>(null)
    let modalInstance: Modal | null = null
    const controller = inject(DELETE_TENANT_CONTROLLER_FACTORY)?.build() as DeleteTenantController
    const vm = ref(controller.vm)
    const alert = inject(ALERT) as Alerter

    onMounted(() => {
      controller.subscribeVM((updatedVm) => {
        vm.value = { ...updatedVm }
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
      validateTenantName(input?: string) {
        controller.validateTenantName(input ?? '')
      },
      validateTenantId(input?: UUID) {
        controller.validateTenantId(input ?? ('' as UUID))
      },
      validateTenantToDelete(input?: string) {
        controller.validateTenantToDelete(input ?? '')
      },
      deleteTenant() {
        controller.delete()
      },
      modal,
      showModal,
      hideModal
    }
  },
  components: {
    RequiredField,
    'i18n-t': I18nT
  },
  props: {
    tenant: {
      type: String as PropType<string>
    }
  },
  name: 'DeleteTenant',
  data: () => ({
    tenantName: '',
    tenantId: '' as UUID,
    disableSubmitBtn: false
  }),
  computed: {
    tenantDeleted() {
      return this.vm.tenantDeleted
    }
  },
  methods: {
    async actionDelete() {
      try {
        this.deleteTenant()
      } catch (error: Error | any) {
        console.error('error :', error)
      }
    },
    setTenantName(tenantName: string) {
      this.tenantName = tenantName
    },
    setTenantId(tenantId: UUID) {
      this.tenantId = tenantId
    }
  },
  watch: {
    tenantName(newTenantName) {
      this.validateTenantToDelete(newTenantName)
    },
    tenantId(newTenantId) {
      this.validateTenantId(newTenantId)
    },
    tenantDeleted() {
      if (this.vm.tenantDeleted) {
        this.hideModal()
        this.vm.tenantDeleted = false
        this.$emit('tenant-deleted')
      }
    }
  }
}
</script>
