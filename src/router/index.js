import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/dashboard',
            component: AppLayout,
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/admin/Dashboard.vue'),
                    meta: { requiresAuth: true, roles: ['Administrador'] }
                },
                {
                    path: '/profile',
                    name: 'profile',
                    component: () => import('@/views/user/Profile.vue'),
                    meta: { requiresAuth: true, roles: ['Administrador', 'Admisionista', 'Médico', 'Paciente'] }
                },
                {
                    path: '/signin',
                    name: 'signin',
                    component: () => import('@/views/public/Signin.vue')
                },
                {
                    path: '/dependents',
                    name: 'dependents',
                    component: () => import('@/views/user/Dependents.vue'),
                    meta: { requiresAuth: true, roles: ['Paciente'] }
                },

                {
                    path: '/quotes',
                    name: 'quotes',
                    component: () => import('@/views/user/Quote.vue'),
                    meta: { requiresAuth: true, roles: ['Paciente'] },
                    children: [
                        {
                            path: '/quotes/',
                            component: () => import('@/views/user/quote/Appointment.vue')
                        },
                        {
                            path: '/quote/payment',
                            component: () => import('@/views/user/quote/Payment.vue')
                        },
                        {
                            path: '/quote/confirmation',
                            component: () => import('@/views/user/quote/Confirmation.vue')
                        }
                    ]
                },
                {
                    path: '/tracking',
                    name: 'tracking',
                    component: () => import('@/views/user/Tracking.vue'),
                    meta: { requiresAuth: true, roles: ['Paciente'] }
                },
                {
                    path: '/listdoctor',
                    name: 'listDoctor',
                    component: () => import('@/views/user/Listdoctor.vue'),
                    meta: { requiresAuth: true, roles: ['Paciente'] }
                },
                {
                    path: '/attentions',
                    name: 'attentions',
                    component: () => import('@/views/doctor/Attentions.vue'),
                    meta: { requiresAuth: true, roles: ['Médico'] }
                },
                {
                    path: '/patientcare',
                    name: 'patientcare',
                    component: () => import('@/views/doctor/PatientCare.vue'),
                    meta: { requiresAuth: true, roles: ['Médico'] }
                },
                {
                    path: '/shifts',
                    name: 'shifts',
                    component: () => import('@/views/admission/Shifts.vue'),
                    meta: { requiresAuth: true, roles: ['Admisionista'] }
                },
                {
                    path: '/patients',
                    name: 'patients',
                    component: () => import('@/views/admission/Patients.vue'),
                    meta: { requiresAuth: true, roles: ['Admisionista'] }
                },
                {
                    path: '/cashregister',
                    name: 'cashregister',
                    component: () => import('@/views/admission/CashRegister.vue'),
                    meta: { requiresAuth: true, roles: ['Admisionista'] }
                },
                {
                    path: '/users',
                    name: 'users',
                    component: () => import('@/views/admin/Users.vue'),
                    meta: { requiresAuth: true, roles: ['Administrador'] }
                },
                {
                    path: '/doctors',
                    name: 'doctors',
                    component: () => import('@/views/admin/Doctors.vue'),
                    meta: { requiresAuth: true, roles: ['Administrador'] }
                },
                {
                    path: '/timetable',
                    name: 'timetable',
                    component: () => import('@/views/admin/Timetable.vue'),
                    meta: { requiresAuth: true, roles: ['Administrador'] }
                }
            ]
        },
        {
            path: '/',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/unauthorized',
            name: 'unauthorized',
            component: () => import('@/views/pages/auth//Unauthorized.vue')
        }
    ]
});
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.sessionUser && authStore.user == null) {
        // El usuario no está autenticado, redirige a la página de inicio de sesión
        next('/');
    } else if (to.meta.roles && !authStore.hasRole(to.meta.roles)) {
        // El usuario no tiene el rol requerido para acceder a la ruta
        // Por ejemplo, si la ruta requiere ['administrador', 'medico'] y el usuario es 'admisionista', no tendrá acceso.
        // console.log(authStore.hasRole(to.meta.roles));
        // console.log(to.meta.roles);
        next('/unauthorized');
    } else {
        // El usuario está autenticado y tiene el rol requerido para acceder a la ruta
        next();
    }
});
export default router;
