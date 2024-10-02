<template>
    <div class="flex items-center justify-center min-h-screen">
        <div class="bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-sm">
            <h2 class="text-2xl font-bold mb-6 text-center">{{ isLogin ? 'Login' : 'Sign Up' }}</h2>

            <form @submit.prevent="isLogin ? handleLogin() : handleSignup()" class="space-y-4">
                <div v-if="!isLogin">
                    <label for="name" class="block text-sm font-medium">Name</label>
                    <UInput v-model="name" type="text" id="name" color="primary" variant="outline"
                        placeholder="Enter your name" required />
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium">Email</label>
                    <UInput v-model="email" type="email" id="email" color="primary" variant="outline"
                        placeholder="Enter your email" required />
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium">Password</label>
                    <UInput v-model="password" type="password" id="password" color="primary" variant="outline"
                        placeholder="Enter your password" required />
                </div>

                <UButton type="submit" color="green" block >
                    {{ isLogin ? 'Login' : 'Sign Up' }}
                </UButton>
            </form>

            <p v-if="errorMessage" class="text-red-500 text-sm mt-4 text-center">{{ errorMessage }}</p>

            <p class="text-center text-sm mt-6 text-white">
                {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
                <button @click="toggleForm" class="text-blue-400 hover:underline" cypress="sign_up">
                    {{ isLogin ? 'Sign Up' : 'Login' }}
                </button>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

// Form fields
const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')

// Toggle between login and signup
const isLogin = ref(true)

const authStore = useAuthStore()
const router = useRouter()

// Handle login
const handleLogin = async () => {
    try {
        await authStore.login(email.value, password.value)
        router.push('/') // Redirect to home after successful login
    } catch (error) {
        errorMessage.value = 'Login failed! Please check your credentials.'
    }
}

// Handle signup
const handleSignup = async () => {
    try {
        await authStore.signup({ name: name.value, email: email.value, password: password.value })
        router.push('/') // Redirect to home after successful signup
    } catch (error) {
        errorMessage.value = 'Signup failed! Please check your information.'
    }
}

// Toggle between login and signup form
const toggleForm = () => {
    isLogin.value = !isLogin.value
    // Reset error message and form fields
    errorMessage.value = ''
    email.value = ''
    password.value = ''
    name.value = ''
}
</script>
