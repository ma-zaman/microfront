<template>
  <div
    class="modal fade"
    tabindex="-1"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    aria-labelledby="deleteInstance"
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
            <i18n-t keypath="confirmInstanceDeletion" tag="span" scope="global">
              <span> {{ instanceType }} </span>
              <span class="text-danger fw-bold"> {{ instanceName }} </span>
              <span class="fw-bold">{{ $t('irreversibleAction') }}</span>
            </i18n-t>
          </div>

          <div class="col-md-12 mb-3">
            <label for="instanceNameField" class="form-label ml-1">
              {{ $t('confirmInstanceName') }} <span id="required">*</span>
            </label>
            <required-field
              id="instanceToDeleteField"
              maxLength="30"
              :field-value="vm?.instanceName"
              :borderError="`form-control ${vm?.instanceNameError ? 'border-danger' : ''}`"
              :lowercase="true"
              @update-value="validateInstanceName($event)"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            :disabled="vm.deletingInstance"
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="$emit('cancel')"
          >
            <span role="cancel">{{ $t('cancel') }}</span>
          </button>
          <button
            :disabled="vm.deletingInstance || !vm.canDeleteInstance"
            id="confirmDelete"
            class="btn btn-primary"
            @click="actionDelete()"
          >
            <span
              v-if="vm.deletingInstance"
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
import { DeleteInstanceController, Alerter } from '@mood/web-adapters'
import { DELETE_INSTANCE_CONTROLLER_FACTORY, ALERT } from '@/DependencyInjection'

import RequiredField from './RequiredField.vue'
import { UUID } from 'crypto'
import { InstanceTypes } from '@mood/domain'

export default {
  setup() {
    const modal = ref<HTMLElement | null>(null)
    let modalInstance: Modal | null = null
    const controller = inject(
      DELETE_INSTANCE_CONTROLLER_FACTORY
    )?.build() as DeleteInstanceController
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
      validateInstanceName(input?: string) {
        controller.validateInstanceName(input ?? '')
      },
      validateInstanceId(input?: UUID) {
        controller.validateInstanceId(input ?? ('' as UUID))
      },
      validateInstanceType(input?: InstanceTypes) {
        controller.validateInstanceType(input ?? ('' as InstanceTypes))
      },
      validateInstanceTenantName(input?: UUID) {
        controller.validateInstanceTenantName(input ?? ('' as UUID))
      },
      validateInstanceTenantId(input?: UUID) {
        controller.validateInstanceTenantId(input ?? ('' as UUID))
      },
      validateInstanceToDelete(input?: string) {
        controller.validateInstanceToDelete(input ?? '')
      },
      deleteInstance() {
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
    instance: {
      type: String as PropType<string>
    }
  },
  name: 'DeleteInstance',
  data: () => ({
    instanceName: '',
    instanceId: '' as UUID,
    disableSubmitBtn: false,
    tenantId: '' as UUID,
    tenantName: '' as string,
    instanceType: '' as InstanceTypes
  }),
  computed: {
    instanceDeleted() {
      return this.vm.instanceDeleted
    }
  },
  methods: {
    async actionDelete() {
      try {
        this.deleteInstance()
      } catch (error: Error | any) {
        console.error('error :', error)
      }
    },
    setInstanceName(instanceName: string) {
      this.instanceName = instanceName
    },
    setInstanceId(instanceId: UUID) {
      this.instanceId = instanceId
    },
    setInstanceTenantId(tenantId: UUID) {
      this.tenantId = tenantId
    },
    setInstanceTenantName(tenantName: string) {
      this.tenantName = tenantName
    },
    setInstanceType(instanceType: InstanceTypes) {
      this.instanceType = instanceType
    }
  },
  watch: {
    instanceName(newInstanceName) {
      this.validateInstanceToDelete(newInstanceName)
    },
    instanceId(newInstanceId) {
      this.validateInstanceId(newInstanceId)
    },
    instanceType(newInstanceType) {
      this.validateInstanceType(newInstanceType)
    },
    instanceDeleted() {
      if (this.vm.instanceDeleted) {
        this.hideModal()
        this.vm.instanceDeleted = false
        this.$emit('instance-deleted')
      }
    },
    tenantId(newTenantId) {
      this.validateInstanceTenantId(newTenantId)
    },
    tenantName(newTenantName) {
      this.validateInstanceTenantName(newTenantName)
    }
  }
}
</script>
