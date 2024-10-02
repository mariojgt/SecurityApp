<template>
    <div class="container mx-auto p-6">
        <div v-if="authStore.user">
            <div class="bg-slate-800 shadow-md rounded-lg p-6">
                <h2 class="text-xl font-semibold mb-4">Vulnerabilities</h2>

                <div class="flex space-x-4 mb-6">
                    <UButton @click="fetchVulnerabilities" color="blue" variant="solid">Refresh List</UButton>
                    <UButton @click="openCreateModal" variant="solid">Create New Vulnerability</UButton>
                    <UButton square label="Logout" color="gray" variant="solid" @click="authStore.logout" />
                </div>

                <ul class="space-y-4">
                    <li v-for="vuln in vulnerabilities" :key="vuln.id" class="">
                        <UCard>
                            <template #header>
                                <h3>{{ vuln.title }}</h3>
                            </template>

                            <p>{{ vuln.description }}</p>

                            <template #footer>
                                <div class="flex space-x-4 mt-4">
                                    <UButton @click="openEditModal(vuln)" color="yellow" variant="solid">Edit</UButton>
                                    <UButton @click="openDeleteModal(vuln.id)" color="red" variant="solid">Delete</UButton>
                                </div>
                            </template>
                        </UCard>
                    </li>
                </ul>

                <!-- Pagination Controls -->
                <div class="flex justify-center items-center mt-4 space-x-2">
                    <UButton
                        :disabled="pagination.current_page === 1"
                        @click="fetchVulnerabilities(pagination.current_page - 1)"
                        color="gray"
                        variant="outline"
                    >
                        Previous
                    </UButton>

                    <span class="text-white">Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>

                    <UButton
                        :disabled="pagination.current_page === pagination.last_page"
                        @click="fetchVulnerabilities(pagination.current_page + 1)"
                        color="gray"
                        variant="outline"
                    >
                        Next
                    </UButton>
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center min-h-screen text-center">
            <p class="text-lg mb-4">You need to log in to view this page.</p>
            <UButton @click="goToLogin" color="green" variant="solid">Go to Login</UButton>
        </div>

        <!-- Create Vulnerability Modal -->
        <UModal v-model="isCreateModalOpen">
            <div class="p-4">
                <h3 class="text-lg mb-4">Create New Vulnerability</h3>
                <div class="mb-4">
                    <UInput v-model="newTitle" color="primary" variant="outline" placeholder="Title" />
                </div>
                <div class="mb-4">
                    <UInput v-model="newDescription" color="primary" variant="outline" placeholder="Description" />
                </div>
                <div class="flex justify-end space-x-4 mt-4">
                    <UButton @click="closeCreateModal" variant="secondary">Cancel</UButton>
                    <UButton @click="confirmCreateVulnerability" color="green" variant="solid">Create</UButton>
                </div>
            </div>
        </UModal>

        <!-- Delete Confirmation Modal -->
        <UModal v-model="isDeleteModalOpen">
            <div class="p-4">
                <h3 class="text-lg mb-4">Confirm Deletion</h3>
                <p>Are you sure you want to delete this vulnerability?</p>
                <div class="flex justify-end space-x-4 mt-4">
                    <UButton @click="closeDeleteModal" variant="secondary">Cancel</UButton>
                    <UButton @click="confirmDeleteVulnerability" color="red" variant="solid">Delete</UButton>
                </div>
            </div>
        </UModal>

        <!-- Edit Vulnerability Modal -->
        <UModal v-model="isEditModalOpen">
            <div class="p-4">
                <h3 class="text-lg mb-4">Edit Vulnerability</h3>
                <div class="mb-4">
                    <UInput v-model="editTitle" color="primary" variant="outline" placeholder="Title" />
                </div>
                <div class="mb-4">
                    <UInput v-model="editDescription" color="primary" variant="outline" placeholder="Description" />
                </div>
                <div class="flex justify-end space-x-4 mt-4">
                    <UButton @click="closeEditModal" variant="secondary">Cancel</UButton>
                    <UButton @click="confirmEditVulnerability" color="blue" variant="solid">Save Changes</UButton>
                </div>
            </div>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useVulnerabilityStore } from '~/stores/vulnerabilities'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const vulnerabilityStore = useVulnerabilityStore()
const router = useRouter()

const vulnerabilities = computed(() => vulnerabilityStore.vulnerabilities)
const pagination = computed(() => vulnerabilityStore.pagination)

const isCreateModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditModalOpen = ref(false)

const selectedVulnerabilityId = ref<number | null>(null)
const editTitle = ref('')
const editDescription = ref('')
const newTitle = ref('')
const newDescription = ref('')

const fetchVulnerabilities = async (page = 1) => {
    await vulnerabilityStore.fetchVulnerabilities(page)
}

// Open and close the create vulnerability modal
const openCreateModal = () => {
    isCreateModalOpen.value = true
}

const closeCreateModal = () => {
    isCreateModalOpen.value = false
    newTitle.value = ''
    newDescription.value = ''
}

const confirmCreateVulnerability = async () => {
    if (newTitle.value && newDescription.value) {
        await vulnerabilityStore.addVulnerability({ title: newTitle.value, description: newDescription.value })
        fetchVulnerabilities()
    }
    closeCreateModal()
}

// Open and close the edit vulnerability modal
const openEditModal = (vulnerability: { id: number, title: string, description: string }) => {
    selectedVulnerabilityId.value = vulnerability.id
    editTitle.value = vulnerability.title
    editDescription.value = vulnerability.description
    isEditModalOpen.value = true
}

const closeEditModal = () => {
    isEditModalOpen.value = false
    selectedVulnerabilityId.value = null
    editTitle.value = ''
    editDescription.value = ''
}

const confirmEditVulnerability = async () => {
    if (selectedVulnerabilityId.value !== null && editTitle.value && editDescription.value) {
        await vulnerabilityStore.updateVulnerability(selectedVulnerabilityId.value, {
            title: editTitle.value,
            description: editDescription.value
        })
        fetchVulnerabilities()
    }
    closeEditModal()
}

// Open and close the delete vulnerability modal
const openDeleteModal = (id: number) => {
    selectedVulnerabilityId.value = id
    isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
    isDeleteModalOpen.value = false
    selectedVulnerabilityId.value = null
}

const confirmDeleteVulnerability = async () => {
    if (selectedVulnerabilityId.value !== null) {
        await vulnerabilityStore.deleteVulnerability(selectedVulnerabilityId.value)
        fetchVulnerabilities()
    }
    closeDeleteModal()
}

const goToLogin = () => {
    router.push('/login')
}

onMounted(() => {
    if (authStore.user) {
        fetchVulnerabilities()
    }
})
</script>
