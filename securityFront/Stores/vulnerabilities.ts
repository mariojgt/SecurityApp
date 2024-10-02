import { defineStore } from "pinia";

export const useVulnerabilityStore = defineStore("vulnerabilities", {
    state: () => ({
        vulnerabilities: [] as object[],
    }),
    actions: {
        async fetchVulnerabilities() {
            const authStore = useAuthStore();
            const config = useRuntimeConfig();
            try {
                const { data, error } = await useFetch(
                    `${config.public.apiBaseUrl}/api/vulnerabilities`,
                    {
                        headers: {
                            Authorization: `Bearer ${authStore.token}`,
                        },
                    }
                );

                if (error.value) {
                    console.error(
                        "Failed to fetch vulnerabilities:",
                        error.value
                    );
                } else {
                    this.vulnerabilities = data.value || [];
                }
            } catch (error) {
                console.error("Failed to fetch vulnerabilities:", error);
            }
        },

        async addVulnerability(data: { title: string; description: string }) {
            const authStore = useAuthStore();
            const config = useRuntimeConfig();
            try {
                const { data: newVulnerability, error } = await useFetch(
                    `${config.public.apiBaseUrl}/api/vulnerabilities`,
                    {
                        method: "POST",
                        body: data,
                        headers: {
                            Authorization: `Bearer ${authStore.token}`,
                        },
                    }
                );

                if (error.value) {
                    console.error("Failed to add vulnerability:", error.value);
                } else if (newVulnerability.value) {
                    this.vulnerabilities.push(newVulnerability.value);
                }
            } catch (error) {
                console.error("Failed to add vulnerability:", error);
            }
        },

        async updateVulnerability(
            id: number,
            data: { title: string; description: string }
        ) {
            const authStore = useAuthStore();
            const config = useRuntimeConfig();
            try {
                const { data: updatedVulnerability, error } = await useFetch(
                    `${config.public.apiBaseUrl}/api/vulnerabilities/${id}`,
                    {
                        method: "PUT",
                        body: data,
                        headers: {
                            Authorization: `Bearer ${authStore.token}`,
                        },
                    }
                );

                if (error.value) {
                    console.error(
                        "Failed to update vulnerability:",
                        error.value
                    );
                } else if (updatedVulnerability.value) {
                    const index = this.vulnerabilities.findIndex(
                        (v) => v.id === id
                    );
                    if (index !== -1)
                        this.vulnerabilities[index] =
                            updatedVulnerability.value;
                }
            } catch (error) {
                console.error("Failed to update vulnerability:", error);
            }
        },

        async deleteVulnerability(id: number) {
            const authStore = useAuthStore();
            const config = useRuntimeConfig();
            try {
                const { error } = await useFetch(
                    `${config.public.apiBaseUrl}/api/vulnerabilities/${id}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${authStore.token}`,
                        },
                    }
                );

                if (error.value) {
                    console.error(
                        "Failed to delete vulnerability:",
                        error.value
                    );
                } else {
                    this.vulnerabilities = this.vulnerabilities.filter(
                        (v) => v.id !== id
                    );
                }
            } catch (error) {
                console.error("Failed to delete vulnerability:", error);
            }
        },
    },
});
