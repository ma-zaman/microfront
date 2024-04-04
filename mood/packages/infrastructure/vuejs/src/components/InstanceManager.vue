<template>
  <div class="d-flex justify-content-center w-100">
    <div id="instance-manager" class="card m-5 mt-3 w-75 mh-100 border-0">
      <v-card flat :border="false" class="mb-3">
        <v-card-title class="d-flex pe-2">
          <v-card-text style="font-size: 1.8rem">
            <MachineToMachineIcon />&nbsp;
            {{ $t('myInstances') }}
          </v-card-text>
          <v-spacer></v-spacer>

          <div class="w-25 mr-5">
            <v-select
              :items="tenantsVm.tenants"
              item-title="name"
              item-value="id"
              :label="$t('selectATenant')"
              @update:model-value="selectTenant"
              aria-setsize="100"
              return-object
              v-model="selectedTenant"
              :autofocus="selectedTenant === null"
              :loading="selectedTenant === null && tenantsVm.loading"
            >
            </v-select>
          </div>

          <div class="w-25">
            <div><v-text-field v-model="search" :label="$t('search')"> </v-text-field></div>
          </div>
          <SearchIcon class="mt-3 text-grey" />
        </v-card-title>
        <v-divider></v-divider>

        <v-data-table
          :headers="getHeaders()"
          :loading="instancesVm.loading"
          :items="instancesVm.instances"
          :search="search"
          density="compact"
          :hover="true"
          :fixed-header="true"
          :fixed-footer="true"
          class="mh-75"
          :no-data-text="$t('noInstanceAvailable')"
          :items-per-page-text="$t('itemsPerPage')"
          :page-text="'{0} ' + $t('of') + ' {2}'"
        >
          <template v-slot:loading>
            <v-skeleton-loader type="heading@0"></v-skeleton-loader>
          </template>

          <template v-slot:[`item.instanceType`]="{ value }">
            <v-chip density="compact" v-if="value === 'prometheus'" class="bg-indigo">
              <PrometheusIcon class="mr-1" width="1.3em" height="1.3em" />
              <span>{{ value }}</span>
            </v-chip>
            <v-chip density="compact" v-else-if="value === 'alertmanager'" class="bg-red">
              <NotificationAlertIcon class="mr-1" width="1.3em" height="1.3em" />
              <span>{{ value }}</span>
            </v-chip>
            <v-chip density="compact" v-else-if="value === 'victoria'" class="bg-green">
              <VictoriaMetricsIcon class="mr-1" width="1.3em" height="1.3em" />
              <span>{{ value }}</span>
            </v-chip>
            <v-chip density="compact" v-else color="#333">
              ??? &nbsp; <span>{{ value }}</span>
            </v-chip>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <div class="action">
              <button
                v-if="item.urls?.length"
                class="btn btn-icon btn-round btn-sm btn-no-outline rounded-circle text-white ml-1 text-bg-primary bg-opacity-75 border-0"
                data-testid="instance-external-redirection"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                :title="$t('tooltipOpenInstance')"
                @click="openUrl(item.urls?.[0])"
              >
                <ExternalLinkIcon></ExternalLinkIcon>
              </button>
              <button
                class="btn btn-icon btn-round btn-sm btn-no-outline rounded-circle text-white ml-1 text-bg-info bg-opacity-75 border-0"
                data-testid="edit-tenant-button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                :title="$t('tooltipUpdateAcl')"
                @click="openUpdateForm(item)"
              >
                <PencilIcon />
              </button>
              <button
                class="btn btn-icon btn-round btn-sm btn-no-outline rounded-circle text-white ml-1 text-bg-danger bg-opacity-75 border-0"
                data-testid="delete-instance-button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                :title="$t('tooltipDeleteInstance')"
                @click="openDeleteInstance(item)"
              >
                <TrashIcon />
              </button>
            </div>
          </template>
        </v-data-table>
        <div class="d-flex justify-content-center py-3">
          <button
            v-if="selectedTenant?.id"
            class="btn btn-primary btn-icon rounded-circle"
            data-testid="add-tenant-btn"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            :title="$t('tooltipCreateInstance')"
            @click="openCreateForm"
          >
            <AddIcon />
          </button>
        </div>
      </v-card>
    </div>
    <InstanceForm
      ref="instanceForm"
      :update="update"
      :tenantName="selectedTenant?.name"
      :tenantId="selectedTenant?.id"
      :instance-to-update="instanceToUpdate"
      @success="fetchInstances(selectedTenant)"
    />
    <DeleteInstance
      ref="deleteInstance"
      @instance-deleted="fetchInstances(selectedTenant)"
    ></DeleteInstance>
  </div>
</template>

<script lang="ts">
import { inject, onMounted, ref } from 'vue'
import { Tooltip } from 'boosted'
import {
  ALERT,
  TENANTS_CONTROLLER_FACTORY,
  INSTANCES_CONTROLLER_FACTORY
} from '@/DependencyInjection'
import { Alerter, TenantsController, InstancesController } from '@mood/web-adapters'
import { Tenant, Instance } from '@mood/domain'
import DeleteInstance from './DeleteInstance.vue'

import InstanceForm from './InstanceForm.vue'
import AddIcon from '@/assets/icons/AddIcon.vue'
import SearchIcon from '@/assets/icons/SearchIcon.vue'
import TrashIcon from '@/assets/icons/TrashIcon.vue'
import NotificationAlertIcon from '@/assets/icons/NotificationAlertIcon.vue'
import MachineToMachineIcon from '@/assets/icons/MachineToMachineIcon.vue'
import ExternalLinkIcon from '@/assets/icons/ExternalLinkIcon.vue'
import VictoriaMetricsIcon from '@/assets/icons/VictoriaMetricsIcon.vue'
import PrometheusIcon from '@/assets/icons/PrometheusIcon.vue'
import PencilIcon from '@/assets/icons/PencilIcon.vue'
import { UUID } from 'crypto'

export default {
  setup() {
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const instancesController = inject(INSTANCES_CONTROLLER_FACTORY)?.build() as InstancesController
    const tenantsController = inject(TENANTS_CONTROLLER_FACTORY)?.build() as TenantsController
    const instanceForm = ref<typeof InstanceForm | null>(null)
    const deleteInstance = ref<typeof DeleteInstance | null>(null)
    const instancesVm = ref(instancesController.vm)
    const tenantsVm = ref(tenantsController.vm)
    const alert = inject(ALERT) as Alerter

    onMounted(() => {
      instancesController.subscribeVM((updatedVm) => {
        instancesVm.value = { ...updatedVm }
        if (instancesVm.value.displayAlert && instancesVm.value.alert) {
          alert.triggerAlert(instancesVm.value.alert)
          updatedVm.displayAlert = false
          instancesVm.value = { ...updatedVm }
        }
      })
      tenantsController.subscribeVM((updatedVm) => {
        tenantsVm.value = { ...updatedVm }
        if (tenantsVm.value.displayAlert && tenantsVm.value.alert) {
          alert.triggerAlert(tenantsVm.value.alert)
          updatedVm.displayAlert = false
          tenantsVm.value = { ...updatedVm }
        }
      })
    })

    return {
      fetchInstances(selectedTenant: Tenant | null) {
        instancesController.vm.tenantId = selectedTenant?.id
        instancesController.vm.tenantName = selectedTenant?.name
        instancesController.fetchInstances()
      },
      fetchTenants() {
        tenantsController.fetchTenants()
      },
      popStoredTenant(): { name: string | undefined; id: UUID | undefined } {
        return instancesController.popStoredTenant()
      },
      instancesVm,
      tenantsVm,
      tooltips,
      instanceForm,
      deleteInstance
    }
  },
  components: {
    SearchIcon,
    NotificationAlertIcon,
    MachineToMachineIcon,
    ExternalLinkIcon,
    TrashIcon,
    DeleteInstance,
    VictoriaMetricsIcon,
    PrometheusIcon,
    AddIcon,
    InstanceForm,
    PencilIcon
  },
  name: 'ManageInstance',
  data: () => ({
    search: '',
    update: false,
    tenants: [] as Tenant[],
    selectedTenant: null as { id: UUID; name: string } | null,
    instancesArray: [] as Instance[] | undefined,
    instanceToUpdate: {} as Instance
  }),
  async created() {
    await this.fetchTenants()
    const { id, name } = this.popStoredTenant()
    if (id && name) {
      this.selectedTenant = { id: id, name: name }
      await this.selectTenant({ id: id, name: name })
    }
    this.updateTooltips()
  },
  computed: {
    locale(): string {
      return this.$i18n.locale
    },
    instances(): Instance[] | undefined {
      return this.instancesVm.instances
    }
  },
  watch: {
    async locale(locale: string) {
      this.$i18n.locale = await locale
      this.updateTooltips()
    },
    async instances(instances: Instance[]) {
      this.instancesArray = await instances
      this.updateTooltips()
    },
    async instancesArray() {
      this.updateTooltips()
    }
  },
  methods: {
    getHeaders() {
      return [
        { title: this.$t('type'), key: 'instanceType' },
        { title: this.$t('name'), key: 'name' },
        { title: this.$t('description'), key: 'description' },
        { title: this.$t('visibility'), key: 'visibility' },
        { title: '', key: 'actions', sortable: false }
      ]
    },
    async success() {
      await this.fetchInstances(this.selectedTenant)
      this.updateTooltips()
    },
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
    async selectTenant(event: { id: UUID; name: string }) {
      this.selectedTenant = { id: event.id, name: event.name }
      this.instancesVm.loading = true
      await this.fetchInstances(this.selectedTenant)
      this.updateTooltips()
    },
    async openUrl(url: string) {
      await this.hideAllTooltips()
      await window.open(url, '_blank')
    },
    openDeleteInstance(instance: Instance) {
      this.hideAllTooltips()
      if (this.deleteInstance) {
        this.deleteInstance.setInstanceName(instance.name)
        this.deleteInstance.setInstanceId(instance.id)
        this.deleteInstance.setInstanceTenantId(instance.tenantId)
        this.deleteInstance.setInstanceTenantName(instance.tenantName)
        this.deleteInstance.setInstanceType(instance.instanceType)
        this.deleteInstance.showModal()
      }
    },
    openCreateForm() {
      this.hideAllTooltips()
      this.update = false
      if (this.instanceForm) this.instanceForm.showModal()
    },
    openUpdateForm(instance: Instance) {
      this.hideAllTooltips()
      this.instanceToUpdate = { ...instance }
      this.update = true
      if (this.instanceForm) {
        this.instanceForm.showModal()
      }
    }
  }
}
</script>
