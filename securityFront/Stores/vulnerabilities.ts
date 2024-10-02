import { defineStore } from "pinia";

interface Vulnerability {
    id: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export const useVulnerabilityStore = defineStore("vulnerabilities", {
    state: () => ({
        vulnerabilities: [] as Vulnerability[],
        pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0,
        },
    }),
    actions: {
        async fetchVulnerabilities(page = 1) {
            const config = useRuntimeConfig();

            try {
                const { data, error } = await useFetch(`${config.public.apiBaseUrl}/api/vulnerabilities?page=${page}`, {
                    headers: {
                        Authorization: `Bearer ${useAuthStore().token}`,
                    },
                });

                if (!error.value) {
                    const responseData = data.value as { data: Vulnerability[], current_page: number, last_page: number, per_page: number, total: number };
                    this.vulnerabilities = responseData.data;
                    this.pagination = {
                        current_page: responseData.current_page,
                        last_page: responseData.last_page,
                        per_page: responseData.per_page,
                        total: responseData.total,
                    };
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
                    this.vulnerabilities.push(newVulnerability.value as Vulnerability);
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
                            updatedVulnerability.value as Vulnerability;
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
