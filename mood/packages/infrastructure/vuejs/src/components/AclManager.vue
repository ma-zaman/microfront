<template>
  <div class="d-flex justify-content-center w-100">
    <div id="acl-manager" class="card m-5 mt-3 w-75 mh-100 border-0">
      <v-card flat :border="false" class="mb-3">
        <v-card-title class="d-flex pe-2">
          <v-card-text style="font-size: 1.8rem">
            <TeamIcon />&nbsp;
            {{ $t('myAcls') }}
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
              v-model="selectedTenantItem"
              :autofocus="selectedTenantItem === null"
              :loading="selectedTenantItem === null && tenantsVm.loading"
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
          :loading="aclsVm.loading"
          :items="aclsVm.acls"
          :search="search"
          density="compact"
          :hover="true"
          :fixed-header="true"
          :fixed-footer="true"
          class="mh-75"
          :no-data-text="$t('noAclAvailable')"
          :items-per-page-text="$t('itemsPerPage')"
          :page-text="'{0} ' + $t('of') + ' {2}'"
          :sort-by="sortBy"
        >
          <template v-slot:loading>
            <v-skeleton-loader type="heading@0"></v-skeleton-loader>
          </template>

          <template v-slot:[`item.ownerType`]="{ value }">
            <v-chip
              density="compact"
              v-if="value === $t('user')"
              class="text-white ml-1 bg-dark bg-opacity-75"
            >
              <UserIcon class="mr-1" />
              <span>{{ value }}</span>
            </v-chip>
            <v-chip
              density="compact"
              v-else-if="value === $t('team')"
              class="text-white ml-1 bg-orange"
            >
              <TeamIcon class="mr-1" width="1.3em" height="1.3em" />
              <span>{{ value }}</span>
            </v-chip>
            <v-chip density="compact" v-else color="#333">
              ??? &nbsp; <span>{{ value }}</span>
            </v-chip>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <div class="action">
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
                v-if="aclsVm.acls && aclsVm.acls.length > 1"
                class="btn btn-icon btn-round btn-sm btn-no-outline rounded-circle text-white ml-1 text-bg-danger bg-opacity-75 border-0"
                data-testid="delete-tenant-button"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                :title="$t('tooltipDeleteAcl')"
                @click="openDeleteAcl(item)"
              >
                <TrashIcon />
              </button>
            </div>
          </template>
        </v-data-table>
        <div class="d-flex justify-content-center py-3">
          <button
            v-if="selectedTenantItem?.name"
            class="btn btn-primary btn-icon rounded-circle"
            data-testid="add-acl-btn"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            :title="$t('tooltipCreateAcl')"
            @click="openCreateForm"
          >
            <AddIcon />
          </button>
          <span
            class="d-inline-block"
            tabindex="0"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            :title="$t('tooltipAddTeam')"
          >
            <button
              v-if="selectedTenantItem?.name"
              class="btn disabled btn-secondary btn-icon rounded-circle ml-2"
              data-testid="add-team-btn"
            >
              <AddTeamIcon />
            </button>
          </span>
        </div>
      </v-card>
    </div>
    <DeleteAcl
      ref="deleteAcl"
      :acl="aclToDelete"
      :acls="aclsArray"
      @acl-deleted="selectTenantWithSleep"
    />
    <AclForm
      ref="aclForm"
      :update="update"
      :acl-to-update="aclToUpdate"
      :tenantName="selectedTenantItem?.name"
      :tenantId="selectedTenantItem?.id"
      @success="success()"
    />
  </div>
</template>

<script lang="ts">
import { inject, onMounted, ref } from 'vue'
import { Tooltip } from 'boosted'
import { ALERT, TENANTS_CONTROLLER_FACTORY, USERS_CONTROLLER_FACTORY } from '@/DependencyInjection'
import { Alerter, TenantsController, AclsController } from '@mood/web-adapters'
import { Tenant, Acl } from '@mood/domain'

import AclForm from './AclForm.vue'
import DeleteAcl from './DeleteAcl.vue'

import SearchIcon from '@/assets/icons/SearchIcon.vue'
import UserIcon from '@/assets/icons/UserIcon.vue'
import TeamIcon from '@/assets/icons/TeamIcon.vue'
import AddIcon from '@/assets/icons/AddIcon.vue'
import PencilIcon from '@/assets/icons/PencilIcon.vue'
import { UUID } from 'crypto'
import TrashIcon from '@/assets/icons/TrashIcon.vue'
import { SortItem } from 'vuetify/lib'
import AddTeamIcon from '@/assets/icons/AddTeamIcon.vue'

export default {
  setup() {
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const aclsController = inject(USERS_CONTROLLER_FACTORY)?.build() as AclsController
    const tenantsController = inject(TENANTS_CONTROLLER_FACTORY)?.build() as TenantsController
    const aclForm = ref<typeof AclForm | null>(null)
    const deleteAcl = ref<typeof DeleteAcl | null>(null)
    const aclsVm = ref(aclsController.vm)
    const tenantsVm = ref(tenantsController.vm)
    const alert = inject(ALERT) as Alerter

    onMounted(() => {
      aclsController.subscribeVM((updatedVm) => {
        aclsVm.value = { ...updatedVm }
        if (aclsVm.value.displayAlert && aclsVm.value.alert) {
          alert.triggerAlert(aclsVm.value.alert)
          updatedVm.displayAlert = false
          aclsVm.value = { ...updatedVm }
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
      fetchAcls(selectedTenantId: UUID | undefined) {
        aclsController.vm.tenantId = selectedTenantId
        aclsController.fetchAcls()
      },
      fetchTenants() {
        tenantsController.fetchTenants()
      },
      popStoredTenant(): { name: string | undefined; id: UUID | undefined } {
        return aclsController.popStoredTenant()
      },
      aclsVm,
      tenantsVm,
      aclForm,
      deleteAcl,
      tooltips
    }
  },
  components: {
    SearchIcon,
    UserIcon,
    TeamIcon,
    AclForm,
    AddIcon,
    PencilIcon,
    TrashIcon,
    DeleteAcl,
    AddTeamIcon
  },
  name: 'ManageAcl',
  data: () => ({
    search: '',
    update: false,
    tenants: [] as Tenant[],
    selectedTenantItem: null as { id: UUID; name: string } | null,
    aclToUpdate: {} as Acl,
    aclToDelete: {} as Acl,
    aclsArray: [] as Acl[] | undefined,
    sortBy: [{ key: 'ownerType', order: 'asc' } as SortItem]
  }),
  async created() {
    await this.fetchTenants()
    const { id, name } = this.popStoredTenant()
    if (id && name) {
      this.selectedTenantItem = { id: id, name: name }
      await this.selectTenant(this.selectedTenantItem)
    }
    this.updateTooltips()
  },
  computed: {
    locale(): string {
      return this.$i18n.locale
    },
    acls(): Acl[] | undefined {
      return this.aclsVm.acls
    }
  },
  watch: {
    async locale(locale: string) {
      this.$i18n.locale = await locale
      this.updateTooltips()
    },
    async acls(acls: Acl[]) {
      this.aclsArray = await acls
      this.updateTooltips()
    },
    async aclsArray() {
      this.updateTooltips()
    }
  },
  methods: {
    getHeaders() {
      return [
        {
          title: this.$t('type'),
          key: 'ownerType',
          value: (item: { ownerType: any }) => {
            return this.$t(item.ownerType)
          }
        },
        { title: this.$t('owner'), key: 'owner' },
        { title: this.$t('role'), key: 'role' },
        { title: '', key: 'actions', sortable: false }
      ]
    },
    async success() {
      this.aclsVm.loading = true
      setTimeout(async () => {
        this.aclsVm.loading = false
        await this.fetchAcls(this.selectedTenantItem?.id)
      }, 4000)
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
    openCreateForm() {
      this.hideAllTooltips()
      this.update = false
      this.aclToUpdate = {
        owner: '',
        ownerType: 'user',
        role: 'viewer',
        tenantId: this.selectedTenantItem ? this.selectedTenantItem.id : ('' as UUID),
        tenantName: this.selectedTenantItem ? this.selectedTenantItem.name : ''
      }
      if (this.aclForm) {
        this.aclForm.showModal()
      }
    },
    async selectTenant(event: { id: UUID; name: string } | null) {
      if (event) {
        this.selectedTenantItem = { id: event.id, name: event.name }
      }
      this.aclsVm.loading = true
      await this.fetchAcls(this.selectedTenantItem?.id)
      this.updateTooltips()
    },
    async selectTenantWithSleep(event: { id: UUID; name: string }) {
      if (event) {
        this.selectedTenantItem = { id: event.id, name: event.name }
      }
      this.aclsVm.loading = true
      setTimeout(async () => {
        this.aclsVm.loading = false
        this.selectTenant(this.selectedTenantItem)
      }, 4000)
    },
    openUpdateForm(acl: Acl) {
      this.hideAllTooltips()
      this.aclToUpdate = { ...acl }
      this.update = true
      if (this.aclForm) {
        this.aclForm.showModal()
      }
    },
    openDeleteAcl(acl: Acl) {
      this.hideAllTooltips()
      this.aclsArray = this.aclsVm.acls
      this.aclToDelete = { ...acl }
      if (this.deleteAcl) {
        this.deleteAcl.setAclTenantId(acl.tenantId)
        this.deleteAcl.showModal()
      }
    }
  }
}
</script>
