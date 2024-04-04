<template>
  <div
    class="modal fade"
    tabindex="-1"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    aria-labelledby="instanceForm"
    aria-hidden="true"
    ref="modal"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered" data-testid="instance-form-modal">
      <div class="modal-content pt-0">
        <div class="modal-header text-bg-secondary p-3 mb-2">
          <h5 class="modal-title text-primary">
            <i18n-t
              :keypath="update ? 'updateAnInstance' : 'createAnInstance'"
              tag="span"
              scope="global"
            >
            </i18n-t>
          </h5>
        </div>
        <form
          role="form"
          @submit.prevent="submit"
          class="form row g-3 needs-validation"
          name="form"
          novalidate
        >
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12 mt-1 mb-2">
                <i18n-t
                  :keypath="update ? 'updateInstanceText' : 'createInstanceText'"
                  tag="span"
                  scope="global"
                >
                  <span class="text-primary fw-bold"> {{ addInstanceVm.instanceTenantName }} </span>
                </i18n-t>
              </div>
            </div>

            <div class="row">
              <div class="input-group mt-1">
                <button
                  :disabled="update"
                  class="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  data-testid="instanceTypeDropdown"
                >
                  {{ $t(addInstanceVm?.instanceType ?? ' ') }}
                </button>
                <ul class="dropdown-menu dropdown-menu-start">
                  <li>
                    <a
                      data-testid="instanceTypePrometheus"
                      class="dropdown-item"
                      @click="validateInstanceType('prometheus')"
                      >{{ $t('prometheus') }}</a
                    >
                  </li>
                  <li>
                    <a
                      data-testid="instanceTypeAlertManager"
                      class="dropdown-item"
                      @click="validateInstanceType('alertmanager')"
                      >{{ $t('alertmanager') }}</a
                    >
                  </li>
                  <li>
                    <a
                      data-testid="instanceTypeVictoria"
                      class="dropdown-item"
                      @click="validateInstanceType('victoria')"
                      >{{ $t('victoria') }}</a
                    >
                  </li>
                </ul>
                <required-field
                  id="instanceName"
                  label-value="instanceName"
                  :field-value="addInstanceVm?.instanceName"
                  :borderError="`form-control ${addInstanceVm?.instanceNameError ? 'border-danger' : ''}`"
                  placeholder="enterInstanceName"
                  @update-value="validateInstanceName($event)"
                />
                <button
                  class="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  data-testid="visibilityDropdown"
                >
                  {{ $t(addInstanceVm?.instanceVisibility ?? ' ') }}
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li>
                    <a
                      data-testid="visibilityViewer"
                      class="dropdown-item"
                      @click="validateInstanceVisibility('private')"
                      >{{ $t('private') }}</a
                    >
                  </li>
                  <li>
                    <a
                      data-testid="visibilityMember"
                      class="dropdown-item"
                      @click="validateInstanceVisibility('internal')"
                      >{{ $t('internal') }}</a
                    >
                  </li>
                </ul>
              </div>
              <div class="row">
                <div
                  v-if="addInstanceVm?.instanceNameError"
                  class="mt-2 ml-2 text-error fw-bold"
                  aria-label="labels error"
                  data-testid="instanceNameError"
                >
                  {{ $t(addInstanceVm?.instanceNameError) }}
                </div>
              </div>
            </div>
            <div class="col-md-12 mb-3 mt-3">
              <label for="tenantDescriptionField" class="form-label ml-1">
                {{ $t('description') }}
              </label>
              <textarea
                id="tenantDescriptionField"
                data-testid="tenantDescriptionField"
                :class="`form-control ${
                  addInstanceVm?.instanceDescriptionError ? 'border-danger' : ''
                }`"
                rows="4"
                :maxlength="1000"
                v-model="addInstanceVm.instanceDescription"
                @input="validateInstanceDescription(($event.target as HTMLButtonElement).value)"
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button
              :disabled="addInstanceVm?.creatingInstance"
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="$emit('cancel')"
            >
              <span role="cancel">{{ $t('cancel') }}</span>
            </button>
            <button
              id="submitBtn"
              :disabled="addInstanceVm?.creatingInstance || !addInstanceVm?.canCreateInstance"
              type="submit"
              class="btn btn-primary"
              data-testid="submitBtn"
            >
              <span
                v-if="addInstanceVm?.creatingInstance"
                id="spinner"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              <span role="submit">{{ update ? $t('update') : $t('create') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { inject, onMounted, ref, type PropType } from 'vue'
import { I18nT } from 'vue-i18n'
import { Modal } from 'boosted'
import { AddInstanceController, UpdateInstanceController, Alerter } from '@mood/web-adapters'
import {
  ADD_INSTANCE_CONTROLLER_FACTORY,
  UPDATE_INSTANCE_CONTROLLER_FACTORY,
  ALERT
} from '@/DependencyInjection'
import { Instance, InstanceTypes, InstanceVisibility } from '@mood/domain'

import RequiredField from './RequiredField.vue'
import { UUID } from 'crypto'

export default {
  setup() {
    const modal = ref<HTMLElement | null>(null)
    let modalInstance: Modal | null = null
    const controllerAddInstance = inject(
      ADD_INSTANCE_CONTROLLER_FACTORY
    )?.build() as AddInstanceController
    const controllerUpdateInstance = inject(
      UPDATE_INSTANCE_CONTROLLER_FACTORY
    )?.build() as UpdateInstanceController
    const addInstanceVm = ref(controllerAddInstance?.vm)
    const updateInstanceVm = ref(controllerUpdateInstance?.vm)
    const alert = inject(ALERT) as Alerter

    onMounted(() => {
      controllerAddInstance?.subscribeVM((updatedVm) => {
        addInstanceVm.value = { ...updatedVm }
        if (addInstanceVm.value.displayAlert && addInstanceVm.value.alert) {
          alert.triggerAlert(addInstanceVm.value.alert)
          updatedVm.displayAlert = false
          addInstanceVm.value = { ...updatedVm }
        }
      })
      controllerUpdateInstance?.subscribeVM((updatedVm) => {
        updateInstanceVm.value = { ...updatedVm }
        if (updateInstanceVm.value.displayAlert && updateInstanceVm.value.alert) {
          alert.triggerAlert(updateInstanceVm.value.alert)
          updatedVm.displayAlert = false
          updateInstanceVm.value = { ...updatedVm }
        }
      })
      if (modal.value) {
        modalInstance = new Modal(modal.value)
      }
    })
    const showModal = () => {
      if (modalInstance) {
        modalInstance.show()
      } else {
        console.error('The modal has not been initialized.')
      }
    }
    const hideModal = () => {
      if (modalInstance) {
        modalInstance.hide()
      } else {
        console.error('The modal has not been initialized.')
      }
    }

    return {
      addInstanceVm,
      updateInstanceVm,
      clearInstance() {
        controllerAddInstance.clearInstanceInstanceType()
        controllerAddInstance.clearInstanceName()
        controllerAddInstance.clearInstanceVisibility()
        controllerAddInstance.clearInstanceDescription()
      },
      validateInstanceTenantId(input?: UUID) {
        controllerAddInstance.validateInstanceTenantId(input ?? ('' as UUID))
        controllerUpdateInstance.validateInstanceTenantId(input ?? ('' as UUID))
      },
      validateInstanceTenantName(input?: string) {
        controllerAddInstance.validateInstanceTenantName(input ?? '')
        controllerUpdateInstance.validateInstanceTenantName(input ?? '')
      },
      validateInstanceDescription(input?: string) {
        controllerAddInstance.validateInstanceDescription(input ?? '')
        controllerUpdateInstance.validateInstanceDescription(input ?? '')
      },
      validateInstanceVisibility(input?: InstanceVisibility) {
        controllerAddInstance.validateInstanceVisibility(input ?? ('' as InstanceVisibility))
        controllerUpdateInstance.validateInstanceVisibility(input ?? ('' as InstanceVisibility))
      },
      validateInstanceType(input?: InstanceTypes) {
        controllerAddInstance.validateInstanceType(input ?? ('' as InstanceTypes))
        controllerUpdateInstance.validateInstanceType(input ?? ('' as InstanceTypes))
      },
      validateInstanceName(input?: string) {
        controllerAddInstance.validateInstanceName(input ?? '')
        controllerUpdateInstance.validateInstanceName(input ?? '')
      },
      validateInstanceId(input?: UUID) {
        controllerUpdateInstance.validateInstanceId(input ?? ('' as UUID))
      },
      createInstance() {
        controllerAddInstance.create()
      },
      updateInstance() {
        controllerUpdateInstance.update()
      },
      modal,
      showModal,
      hideModal
    }
  },
  props: {
    update: {
      type: Boolean,
      default: false
    },
    tenantId: {
      type: String as PropType<UUID>
    },
    tenantName: {
      type: String as PropType<string>
    },
    instanceToUpdate: {
      type: Object as PropType<Instance>
    }
  },
  components: {
    RequiredField,
    'i18n-t': I18nT
  },
  name: 'InstanceForm',
  data: () => ({
    disableSubmitBtn: false,
    instance: {} as Instance
  }),
  computed: {
    instanceCreated() {
      return this.addInstanceVm?.instanceCreated
    },
    instanceUpdated() {
      return this.updateInstanceVm?.instanceUpdated
    }
  },
  watch: {
    tenantId(newTenantId) {
      this.validateInstanceTenantId(newTenantId)
      this.clearInstance()
    },
    tenantName(newTenantName) {
      this.validateInstanceTenantName(newTenantName)
      this.clearInstance()
    },
    update(newUpdate) {
      if (!newUpdate) {
        this.clearInstance()
      }
      this.addInstanceVm.displayAlert = false
    },
    instanceCreated() {
      if (this.addInstanceVm.instanceCreated) {
        this.clearInstance()
        this.hideModal()
        this.addInstanceVm.instanceCreated = false
        this.$emit('success')
      }
    },
    instanceToUpdate(newInstanceToUpdate) {
      if (this.update) {
        this.validateInstanceDescription(newInstanceToUpdate.description)
        this.validateInstanceName(newInstanceToUpdate.name)
        this.validateInstanceType(newInstanceToUpdate.instanceType)
        this.validateInstanceVisibility(newInstanceToUpdate.visibility)
        this.validateInstanceId(newInstanceToUpdate.id)
      }
    },
    instanceUpdated() {
      if (this.updateInstanceVm.instanceUpdated) {
        this.hideModal()
        this.updateInstanceVm.instanceUpdated = false
        this.$emit('success')
      }
    }
  },
  methods: {
    async submit() {
      try {
        if (!this.update) {
          this.createInstance()
        } else {
          this.updateInstanceVm.instanceUpdated = false
          this.updateInstance()
        }
      } catch (error: any) {
        console.error('error :', error)
      }
    }
  }
}
</script>
