<template>
  <div class="d-flex justify-content-md-center w-100 zindex-modal">
    <div id="tenant-manager" class="card m-5 mt-3 w-75 mh-100 border-0">
      <v-card flat :border="false" class="mb-3">
        <v-card-title class="d-flex pe-2">
          <v-card-text style="font-size: 1.8rem">
            <HierarchyIcon /> &nbsp;
            {{ $t('myTenants') }}
          </v-card-text>
          <v-spacer></v-spacer>

          <div class="w-25">
            <v-text-field v-model="search" :label="$t('search')"></v-text-field>
          </div>
          <SearchIcon class="mt-3 text-grey" />
        </v-card-title>
        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :loading="vm.loading"
          :items="vm.tenants"
          :search="search"
          density="compact"
          :hover="true"
          :fixed-header="true"
          :fixed-footer="true"
          class="mh-75"
          :no-data-text="$t('noTenantAvailable')"
          :items-per-page-text="$t('itemsPerPage')"
          :page-text="'{0} ' + $t('of') + ' {2}'"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <div class="action">
              <button
                v-if="item.url?.grafana"
                class="btn btn-icon btn-round btn-sm btn-no-outline rounded-circle text-white ml-1 text-bg-primary bg-opacity-75 border-0"
                data-testid="grafana-tenant-button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                :title="$t('tooltipOpenGrafana')"
                @click="openUrl(item.url?.grafana)"
              >
                <GrafanaIcon height="16" width="16" />
              </button>
              <button
                class="btn btn-icon btn-round btn-sm btn-no-outline rounded-circle text-white ml-1 text-bg-dark bg-opacity-75 border-0"
                data-testid="manage-instance-tenant-button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                :title="$t('tooltipOpenManageInstance')"
                @click="openTenantInstance(item)"
              >
                <MachineToMachineIcon height="16" width="16" />
              </button>
              <button
                class="btn btn-icon btn-round btn-sm btn-no-outline rounded-circle text-white ml-1 text-bg-dark bg-opacity-75 border-0"
                data-testid="manage-acl-tenant-button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                :title="$t('tooltipOpenManageAcl')"
                @click="openTenantAcl(item)"
              >
                <TeamIcon height="16" width="16" />
              </button>
              <button
                class="btn btn-icon btn-round btn-sm btn-no-outline rounded-circle text-white ml-1 text-bg-info bg-opacity-75 border-0"
                data-testid="edit-tenant-button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                :title="$t('tooltipUpdateTenant')"
                @click="openUpdateForm(item)"
              >
                <PencilIcon />
              </button>
              <button
                class="btn btn-icon btn-round btn-sm btn-no-outline rounded-circle text-white ml-1 text-bg-danger bg-opacity-75 border-0"
                data-testid="delete-tenant-button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                :title="$t('tooltipDeleteTenant')"
                @click="openDeleteTenant(item)"
              >
                <TrashIcon />
              </button>
            </div>
          </template>
          <template v-slot:loading>
            <v-skeleton-loader type="heading@0"></v-skeleton-loader>
          </template>
        </v-data-table>
        <div class="d-flex justify-content-center py-3">
          <button
            class="btn btn-primary btn-icon rounded-circle"
            data-testid="add-tenant-btn"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            :title="$t('tooltipCreateTenant')"
            @click="openCreateForm"
          >
            <AddIcon />
          </button>
        </div>
      </v-card>
    </div>
    <delete-tenant ref="deleteTenant" @tenant-deleted="fetchTenants()"></delete-tenant>
    <TenantForm
      ref="tenantForm"
      :update="update"
      :tenantToUpdate="tenant"
      @success="fetchTenants()"
    />
  </div>
</template>

<script lang="ts">
import { inject, onMounted, ref } from 'vue'
import { Tooltip } from 'boosted'
import { ALERT, TENANTS_CONTROLLER_FACTORY } from '@/DependencyInjection'
import { Alerter, TenantsController } from '@mood/web-adapters'

import TenantForm from './TenantForm.vue'
import AddIcon from '@/assets/icons/AddIcon.vue'
import DeleteTenant from './DeleteTenant.vue'
import PencilIcon from '@/assets/icons/PencilIcon.vue'
import TrashIcon from '@/assets/icons/TrashIcon.vue'
import { Tenant } from '@mood/domain'
import SearchIcon from '@/assets/icons/SearchIcon.vue'
import HierarchyIcon from '@/assets/icons/HierarchyIcon.vue'
import GrafanaIcon from '@/assets/icons/GrafanaIcon.vue'
import TeamIcon from '@/assets/icons/TeamIcon.vue'
import MachineToMachineIcon from '@/assets/icons/MachineToMachineIcon.vue'

export default {
  setup() {
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const controller = inject(TENANTS_CONTROLLER_FACTORY)?.build() as TenantsController
    const tenantForm = ref<typeof TenantForm | null>(null)
    const deleteTenant = ref<typeof DeleteTenant | null>(null)
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
    })

    return {
      fetchTenants() {
        controller.fetchTenants()
      },
      redirectToTenantAcl(tenant: Tenant) {
        // TODO : Split controller in Update & Redirect
        // controller.updateCurrentTenant(tenant)
        // controller.redirectToTenantAcl()
        controller.displayTenantAcl(tenant)
      },
      redirectToTenantInstance(tenant: Tenant) {
        controller.displayTenantInstance(tenant)
      },
      vm,
      tenantForm,
      deleteTenant,
      tooltips
    }
  },
  components: {
    TenantForm,
    AddIcon,
    DeleteTenant,
    PencilIcon,
    TrashIcon,
    SearchIcon,
    GrafanaIcon,
    HierarchyIcon,
    TeamIcon,
    MachineToMachineIcon
  },
  name: 'ManageTenant',
  data: () => ({
    search: '',
    headers: [
      { title: 'Tenant', key: 'name' },
      { title: 'Description', key: 'description' },
      {
        title: 'ID Orange Carto',
        key: 'labels',
        value: (item: { labels: any }) =>
          `${
            item.labels instanceof Map
              ? item.labels.get('com.orange.repository.orangecarto/id')
              : item.labels['com.orange.repository.orangecarto/id']
          }`
      },
      { title: '', key: 'actions', sortable: false }
    ],
    update: false,
    tenant: {} as Tenant
  }),

  created() {
    this.fetchTenants()
    this.updateTooltips()
  },
  computed: {
    locale() {
      return this.$i18n.locale
    },
    tenants() {
      return this.vm.tenants
    }
  },
  watch: {
    async locale(locale: string) {
      this.$i18n.locale = await locale
      this.updateTooltips()
    },
    async tenants(tenants) {
      this.vm.tenants = await tenants
      this.updateTooltips()
    }
  },
  methods: {
    updateTooltips() {
      this.tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]')
      this.tooltips.forEach(
        (tooltip) =>
          new Tooltip(tooltip, {
            trigger: 'hover'
          })
      )
    },
    async hideAllTooltips() {
      this.tooltips.forEach((tooltip) => {
        const instance = Tooltip.getInstance(tooltip)
        instance.hide()
      })
      return
    },
    async openUrl(url: string) {
      await window.open(url, '_blank')
    },
    openCreateForm() {
      this.hideAllTooltips()
      this.tenant = {
        id: '0-0-0-0-0',
        name: ''
      }
      this.update = false
      if (this.tenantForm) this.tenantForm.showModal()
    },
    openDeleteTenant(tenant: Tenant) {
      this.hideAllTooltips()
      if (this.deleteTenant) {
        this.deleteTenant.setTenantName(tenant.name)
        this.deleteTenant.setTenantId(tenant.id)
        this.deleteTenant.showModal()
      }
    },
    openUpdateForm(tenant: Tenant) {
      this.hideAllTooltips()
      this.tenant = { ...tenant }
      this.update = true
      if (this.tenantForm) this.tenantForm.showModal()
    },
    openTenantAcl(tenant: Tenant) {
      this.hideAllTooltips()
      this.redirectToTenantAcl(tenant)
    },
    openTenantInstance(tenant: Tenant) {
      this.hideAllTooltips()
      this.redirectToTenantInstance(tenant)
    }
  }
}
</script>
