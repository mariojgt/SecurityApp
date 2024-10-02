import { defineStore } from "pinia";
import { useCookie } from "#app";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: useCookie("auth_token").value as string | null,
        user: null as object | null,
    }),
    actions: {
        async login(email: string, password: string) {
            const config = useRuntimeConfig();
            try {
                const { data, error } = await useFetch(`${config.public.apiBaseUrl}/api/login`, {
                    method: "POST",
                    body: { email, password },
                });

                if (error.value) {
                    throw new Error("Invalid login credentials");
                }

                this.token = (data.value as { token: string; user: object }).token;
                this.user = (data.value as { token: string; user: object }).user;

                useCookie("auth_token").value = this.token;
            } catch (error) {
                this.$reset();
                throw new Error("Invalid login credentials");
            }
        },

        async signup({ name, email, password }: { name: string; email: string; password: string }) {
            const config = useRuntimeConfig();
            try {
                const { data, error } = await useFetch<{ token: string; user: object }>(`${config.public.apiBaseUrl}/api/signup`, {
                    method: "POST",
                    body: {
                        name,
                        email,
                        password,
                        password_confirmation: password,
                    },
                });

                if (error.value) {
                    throw new Error("Signup failed");
                }

                if (data.value) {
                    this.token = data.value.token;
                    this.user = data.value.user;
                } else {
                    throw new Error("Signup failed");
                }

                useCookie("auth_token").value = this.token;
            } catch (error) {
                this.$patch((state) => {
                    state.token = null;
                    state.user = null;
                });
                useCookie("auth_token").value = null;
                throw new Error("Signup failed. Please check your details.");
            }
        },

        logout() {
            this.token = null;
            this.user = null;
            useCookie("auth_token").value = null;
        },
    },
    persist: true,
});
