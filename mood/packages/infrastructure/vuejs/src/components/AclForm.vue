<template>
  <div
    class="modal fade"
    tabindex="-1"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    aria-labelledby="aclForm"
    aria-hidden="true"
    ref="modal"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered" data-testid="acl-form-modal">
      <div class="modal-content pt-0">
        <div class="modal-header text-bg-secondary p-3 mb-2">
          <h5 class="modal-title text-primary">
            <i18n-t :keypath="update ? 'updateAnAcl' : 'createAnAcl'" tag="span" scope="global">
              <span class="text-white"> {{ AddAclVm.aclTenantName }} </span>
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
                  :keypath="update ? 'updateAclText' : 'createAclText'"
                  tag="span"
                  scope="global"
                >
                  <span class="text-primary fw-bold"> {{ AddAclVm.aclTenantName }} </span>
                  <br />
                  <a
                    :href="aclURL"
                    target="_blank"
                    class="link-primary link-offset-2 link-underline-opacity-10 link-underline-opacity-100-hover"
                    >{{ $t('here') }}</a
                  >
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
                  data-testid="ownerTypeDropdown"
                >
                  {{ $t(AddAclVm?.aclOwnerType ?? ' ') }}
                </button>
                <ul class="dropdown-menu dropdown-menu-start">
                  <li>
                    <a
                      data-testid="ownerTypeUser"
                      class="dropdown-item"
                      @click="validateAclOwnerType('user')"
                      >{{ $t('user') }}</a
                    >
                  </li>
                  <li>
                    <a
                      data-testid="ownerTypeTeam"
                      class="dropdown-item"
                      @click="validateAclOwnerType('team')"
                      >{{ $t('team') }}</a
                    >
                  </li>
                </ul>
                <required-field
                  id="aclOwner"
                  :disabled="update"
                  label-value="aclOwner"
                  :field-value="AddAclVm?.aclOwner"
                  :borderError="`form-control ${AddAclVm?.aclOwnerError ? 'border-danger' : ''}`"
                  :placeholder="AddAclVm?.aclOwnerType === 'user' ? 'enterMail' : 'enterTeamName'"
                  @update-value="validateAclOwner($event)"
                />
                <button
                  class="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  data-testid="roleDropdown"
                >
                  {{ $t(AddAclVm?.aclRole ?? ' ') }}
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li>
                    <a
                      data-testid="roleViewer"
                      class="dropdown-item"
                      @click="validateAclRole('viewer')"
                      >{{ $t('viewer') }}</a
                    >
                  </li>
                  <li>
                    <a
                      data-testid="roleMember"
                      class="dropdown-item"
                      @click="validateAclRole('member')"
                      >{{ $t('member') }}</a
                    >
                  </li>
                  <li>
                    <a
                      data-testid="roleAdmin"
                      class="dropdown-item"
                      @click="validateAclRole('administrator')"
                      >{{ $t('administrator') }}</a
                    >
                  </li>
                </ul>
              </div>
              <div class="row">
                <div
                  v-if="AddAclVm?.aclOwnerError"
                  class="mt-2 ml-2 text-error fw-bold"
                  aria-label="labels error"
                  data-testid="aclOwnerError"
                >
                  {{ $t(AddAclVm?.aclOwnerError) }}
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              :disabled="AddAclVm?.creatingAcl"
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="$emit('cancel')"
            >
              <span role="cancel">{{ $t('cancel') }}</span>
            </button>
            <button
              id="submitBtn"
              :disabled="AddAclVm?.creatingAcl || !AddAclVm?.canCreateAcl"
              type="submit"
              class="btn btn-primary"
              data-testid="submitBtn"
            >
              <span
                v-if="AddAclVm?.creatingAcl"
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
import { AddAclController, Alerter, UpdateAclController } from '@mood/web-adapters'
import {
  ADD_ACL_CONTROLLER_FACTORY,
  ALERT,
  UPDATE_ACL_CONTROLLER_FACTORY
} from '@/DependencyInjection'
import { Acl, AclOwnerTypes, RoleTypes } from '@mood/domain'

import RequiredField from './RequiredField.vue'
import { UUID } from 'crypto'

export default {
  setup() {
    const aclURL = process.env.VITE_ACL_URL
    const modal = ref<HTMLElement | null>(null)
    let modalInstance: Modal | null = null
    const controllerAddAcl = inject(ADD_ACL_CONTROLLER_FACTORY)?.build() as AddAclController
    const controllerUpdateAcl = inject(
      UPDATE_ACL_CONTROLLER_FACTORY
    )?.build() as UpdateAclController
    const AddAclVm = ref(controllerAddAcl?.vm)
    const UpdateAclVm = ref(controllerUpdateAcl?.vm)
    const alert = inject(ALERT) as Alerter

    onMounted(() => {
      controllerAddAcl?.subscribeVM((updatedVm) => {
        AddAclVm.value = { ...updatedVm }
        if (AddAclVm.value.displayAlert && AddAclVm.value.alert) {
          alert.triggerAlert(AddAclVm.value.alert)
          updatedVm.displayAlert = false
          AddAclVm.value = { ...updatedVm }
        }
      })
      controllerUpdateAcl?.subscribeVM((updatedVm) => {
        UpdateAclVm.value = { ...updatedVm }
        if (UpdateAclVm.value.displayAlert && UpdateAclVm.value.alert) {
          alert.triggerAlert(UpdateAclVm.value.alert)
          updatedVm.displayAlert = false
          UpdateAclVm.value = { ...updatedVm }
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
      aclURL,
      AddAclVm,
      UpdateAclVm,
      clearAcl() {
        controllerAddAcl.clearAclOwner()
        controllerAddAcl.clearAclOwnerType()
        controllerAddAcl.clearAclRole()
      },
      validateAclId(input?: UUID) {
        controllerUpdateAcl.validateAclId(input ?? ('' as UUID))
      },
      validateAclTenantId(input?: UUID) {
        controllerAddAcl.validateAclTenantId(input ?? ('' as UUID))
        controllerUpdateAcl.validateAclTenantId(input ?? ('' as UUID))
      },
      validateAclTenantName(input?: string) {
        controllerAddAcl.validateAclTenantName(input ?? '')
        controllerUpdateAcl.validateAclTenantName(input ?? '')
      },
      validateAclOwner(input?: string) {
        controllerAddAcl.validateAclOwner(input ?? '')
        controllerUpdateAcl.validateAclOwner(input ?? '')
      },
      validateAclOwnerType(input?: AclOwnerTypes) {
        controllerAddAcl.validateAclOwnerType(input ?? 'user')
        controllerUpdateAcl.validateAclOwnerType(input ?? 'user')
      },
      validateAclRole(input?: RoleTypes) {
        controllerAddAcl.validateAclRole(input ?? 'viewer')
        controllerUpdateAcl.validateAclRole(input ?? 'viewer')
      },
      createAcl() {
        controllerAddAcl.create()
      },
      updateAcl() {
        controllerUpdateAcl.update()
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
    aclToUpdate: {
      type: Object as PropType<Acl>
    },
    tenantId: {
      type: String as PropType<UUID>
    },
    tenantName: {
      type: String as PropType<string>
    }
  },
  components: {
    RequiredField,
    'i18n-t': I18nT
  },
  name: 'AclForm',
  data: () => ({
    disableSubmitBtn: false,
    acl: {} as Acl
  }),
  computed: {
    aclCreated() {
      return this.AddAclVm?.aclCreated
    },
    aclUpdated() {
      return this.UpdateAclVm?.aclUpdated
    }
  },
  watch: {
    tenantId(newTenantId) {
      this.validateAclTenantId(newTenantId)
      this.clearAcl()
    },
    tenantName(newTenantName) {
      this.validateAclTenantName(newTenantName)
      this.clearAcl()
    },
    aclToUpdate(newAclToUpdate) {
      if (this.update) {
        this.validateAclId(newAclToUpdate.id)
        this.validateAclOwner(newAclToUpdate.owner)
        this.validateAclOwnerType(newAclToUpdate.ownerType)
        this.validateAclRole(newAclToUpdate.role)
      }
    },
    update(newUpdate) {
      if (!newUpdate) {
        this.clearAcl()
      }
      this.AddAclVm.displayAlert = false
    },
    aclCreated() {
      if (this.AddAclVm.aclCreated) {
        this.clearAcl()
        this.hideModal()
        this.AddAclVm.aclCreated = false
        this.$emit('success')
      }
    },
    aclUpdated() {
      if (this.UpdateAclVm.aclUpdated) {
        this.hideModal()
        this.UpdateAclVm.aclUpdated = false
        this.$emit('success')
      }
    }
  },
  methods: {
    async submit() {
      try {
        if (!this.update) {
          this.createAcl()
        } else {
          this.UpdateAclVm.aclUpdated = false
          this.updateAcl()
        }
      } catch (error: any) {
        console.error('error :', error)
      }
    }
  }
}
</script>
