// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    modules: ["@nuxt/ui", "@pinia/nuxt"],
    router: {
        middleware: "auth",
    },
    runtimeConfig: {
        public: {
            apiBaseUrl:
                process.env.NUXT_PUBLIC_API_BASE_URL
        },
    },
});
