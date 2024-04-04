<template>
  <div
    class="modal fade"
    tabindex="-1"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    aria-labelledby="tenantForm"
    aria-hidden="true"
    ref="modal"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered" data-testid="tenant-form-modal">
      <div class="modal-content pt-0">
        <div class="modal-header text-bg-secondary p-3 mb-4">
          <h5 class="modal-title text-primary">
            {{ update ? $t('updateATenant') : $t('createATenant') }}
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
              <div class="col-md-6">
                <label for="tenantNameField" class="form-label ml-1">
                  {{ $t('tenantName') }} <span id="required">*</span>
                </label>
              </div>
              <div class="col-md-6">
                <label for="tenantLabelField" class="form-label ml-1">
                  {{ $t('orangeCartoCode') }} <span id="required">*</span>
                  <button
                    type="button"
                    class="btn btn-link p-0 m-0"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    :title="$t('findOrangeCarto')"
                  >
                    <a :href="orangeCartoURL" target="_blank" rel="noopener noreferrer">
                      <InfoIcon />
                    </a>
                    <span class="visually-hidden">Helper Orange Carto</span>
                  </button>
                </label>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <required-field
                  id="tenantNameField"
                  maxLength="30"
                  label-value="tenantName"
                  :field-value="AddTenantVm?.tenantName"
                  :borderError="`form-control ${
                    AddTenantVm?.tenantNameError ? 'border-danger' : ''
                  }`"
                  :lowercase="true"
                  @update-value="validateTenantName($event)"
                />
                <div
                  v-if="AddTenantVm?.tenantNameError"
                  class="mt-2 ml-2 text-error fw-bold"
                  aria-label="tenant name error"
                >
                  {{ $t(AddTenantVm?.tenantNameError) }}
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <required-field
                  id="tenantLabelField"
                  :disabled="update"
                  label-value="orangeCartoCode"
                  :field-value="
                    AddTenantVm?.tenantLabels?.get('com.orange.repository.orangecarto/id')
                  "
                  :borderError="`form-control ${
                    AddTenantVm?.tenantLabelsError ? 'border-danger' : ''
                  }`"
                  maxLength="5"
                  @update-value="validateTenantLabels($event)"
                />
                <div
                  v-if="AddTenantVm?.tenantLabelsError"
                  class="mt-2 ml-2 text-error fw-bold"
                  aria-label="labels error"
                >
                  {{ $t(AddTenantVm?.tenantLabelsError) }}
                </div>
              </div>
              <div class="col-md-12 mb-3">
                <label for="tenantDescriptionField" class="form-label ml-1">
                  {{ $t('description') }} <span id="required">*</span>
                </label>
                <textarea
                  id="tenantDescriptionField"
                  data-testid="tenantDescriptionField"
                  :class="`form-control ${
                    AddTenantVm?.tenantDescriptionError ? 'border-danger' : ''
                  }`"
                  rows="4"
                  :maxlength="1000"
                  v-model="AddTenantVm.tenantDescription"
                  @input="validateTenantDescription(($event.target as HTMLButtonElement).value)"
                ></textarea>

                <div
                  v-if="AddTenantVm?.tenantDescriptionError"
                  class="mt-2 ml-2 text-error fw-bold"
                  aria-label="description error"
                >
                  {{ $t(AddTenantVm?.tenantDescriptionError) }}
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              :disabled="AddTenantVm?.creatingTenant"
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="$emit('cancel')"
            >
              <span role="cancel">{{ $t('cancel') }}</span>
            </button>
            <button
              id="submitBtn"
              :disabled="AddTenantVm?.creatingTenant || !AddTenantVm?.canCreateTenant"
              type="submit"
              class="btn btn-primary"
              data-testid="submitBtn"
            >
              <span
                v-if="AddTenantVm?.creatingTenant"
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
import { Modal, Tooltip } from 'boosted'
import { AddTenantController, Alerter, UpdateTenantController } from '@mood/web-adapters'
import {
  ADD_TENANT_CONTROLLER_FACTORY,
  UPDATE_TENANT_CONTROLLER_FACTORY,
  ALERT
} from '@/DependencyInjection'
import { Tenant } from '@mood/domain'

import RequiredField from './RequiredField.vue'
import InfoIcon from '@/assets/icons/InfoIcon.vue'

export default {
  setup() {
    const orangeCartoURL = process.env.VITE_ORANGECARTO_URL
    const modal = ref<HTMLElement | null>(null)
    let modalInstance: Modal | null = null
    const controllerAddTenant = inject(
      ADD_TENANT_CONTROLLER_FACTORY
    )?.build() as AddTenantController
    const controllerUpdateTenant = inject(
      UPDATE_TENANT_CONTROLLER_FACTORY
    )?.build() as UpdateTenantController
    const AddTenantVm = ref(controllerAddTenant?.vm)
    const UpdateTenantVm = ref(controllerUpdateTenant?.vm)
    const alert = inject(ALERT) as Alerter

    onMounted(() => {
      controllerAddTenant?.subscribeVM((updatedVm) => {
        AddTenantVm.value = { ...updatedVm }
        if (AddTenantVm.value.displayAlert && AddTenantVm.value.alert) {
          alert.triggerAlert(AddTenantVm.value.alert)
          updatedVm.displayAlert = false
          AddTenantVm.value = { ...updatedVm }
        }
      })
      controllerUpdateTenant?.subscribeVM((updatedVm) => {
        UpdateTenantVm.value = { ...updatedVm }
        if (UpdateTenantVm.value.displayAlert && UpdateTenantVm.value.alert) {
          alert.triggerAlert(UpdateTenantVm.value.alert)
          updatedVm.displayAlert = false
          UpdateTenantVm.value = { ...updatedVm }
        }
      })
      if (modal.value) {
        modalInstance = new Modal(modal.value)
      }
    })
    const showModal = () => {
      if (modalInstance) {
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        tooltips.forEach((tooltip) => new Tooltip(tooltip))
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
      orangeCartoURL,
      AddTenantVm,
      UpdateTenantVm,
      clearTenantName() {
        controllerAddTenant.clearTenantName()
      },
      clearTenantDescription() {
        controllerAddTenant.clearTenantDescription()
      },
      clearTenantLabels() {
        controllerAddTenant.clearTenantLabels()
      },
      validateTenantName(input?: string) {
        controllerAddTenant.validateTenantName(input ?? '')
      },
      validateTenantDescription(input?: string) {
        controllerAddTenant.validateTenantDescription(input ?? '')
      },
      validateTenantLabels(input?: string) {
        controllerAddTenant.validateTenantLabels(
          new Map<string, string>().set('com.orange.repository.orangecarto/id', input ?? '')
        )
      },
      createTenant() {
        controllerAddTenant.create()
      },
      updateTenant(tenant: Tenant) {
        controllerUpdateTenant.validateTenant(tenant)
        controllerUpdateTenant.update()
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
    tenantToUpdate: {
      type: Object as PropType<Tenant>
    }
  },
  components: {
    RequiredField,
    InfoIcon
  },
  name: 'TenantForm',
  data: () => ({
    disableSubmitBtn: false,
    tenant: {} as Tenant
  }),
  computed: {
    tenantCreated() {
      return this.AddTenantVm?.tenantCreated
    },
    tenantUpdated() {
      return this.UpdateTenantVm?.tenantUpdated
    }
  },
  mounted() {
    if (this.update && this.tenantToUpdate) {
      this.tenant = this.tenantToUpdate
      this.validateTenantName(this.tenantToUpdate.name)
      this.validateTenantDescription(this.tenantToUpdate.description)
      this.validateTenantLabels(
        this.tenantToUpdate.labels?.get('com.orange.repository.orangecarto/id')
      )
    }
  },
  watch: {
    visible(newVisible) {
      if (!newVisible) this.disableSubmitBtn = false
    },
    update(newUpdate) {
      if (!newUpdate) {
        this.clearTenantName()
        this.clearTenantDescription()
        this.clearTenantLabels()
      }
      this.AddTenantVm.displayAlert = false
      this.UpdateTenantVm.displayAlert = false
    },
    tenantToUpdate(newTenantToUpdate) {
      this.tenant = { ...newTenantToUpdate }
      if (this.tenant.labels) {
        this.tenant.labels = new Map().set(
          'com.orange.repository.orangecarto/id',
          newTenantToUpdate.labels['com.orange.repository.orangecarto/id']
        )
        this.validateTenantName(this.tenant.name)
        this.validateTenantDescription(this.tenant.description)
        this.validateTenantLabels(this.tenant.labels.get('com.orange.repository.orangecarto/id'))
      }
    },
    tenantCreated() {
      if (this.AddTenantVm.tenantCreated) {
        this.hideModal()
        this.clearTenantName()
        this.clearTenantDescription()
        this.clearTenantLabels()
        this.AddTenantVm.tenantCreated = false
        this.$emit('success')
      }
    },
    tenantUpdated() {
      if (this.UpdateTenantVm.tenantUpdated) {
        this.hideModal()
        this.UpdateTenantVm.tenantUpdated = false
        this.$emit('success')
      }
    }
  },
  methods: {
    async submit() {
      try {
        if (!this.update) {
          this.createTenant()
        } else {
          this.UpdateTenantVm.tenantUpdated = false
          this.tenant.name = this.AddTenantVm.tenantName || ''
          this.tenant.description = this.AddTenantVm.tenantDescription || ''
          this.tenant.labels =
            this.AddTenantVm.tenantLabels ||
            new Map().set('com.orange.repository.orangecarto/id', '')
          this.updateTenant(this.tenant)
        }
      } catch (error: Error | any) {
        console.error('error :', error)
      }
    }
  }
}
</script>
