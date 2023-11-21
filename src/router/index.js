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
                    component: () => import('@/views/admin/Dashboard.vue')
                },
                {
                    path: '/profile',
                    name: 'profile',
                    component: () => import('@/views/user/Profile.vue')
                },
                {
                    path: '/signin',
                    name: 'signin',
                    component: () => import('@/views/public/Signin.vue')
                },
                {
                    path: '/dependents',
                    name: 'dependents',
                    component: () => import('@/views/user/Dependents.vue')
                },

                {
                    path: '/quotes',
                    name: 'quotes',
                    component: () => import('@/views/user/Quote.vue'),
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
                    component: () => import('@/views/user/Tracking.vue')
                },
                {
                    path: '/listdoctor',
                    name: 'listDoctor',
                    component: () => import('@/views/user/Listdoctor.vue')
                },
                {
                    path: '/attentions',
                    name: 'attentions',
                    component: () => import('@/views/doctor/Attentions.vue')
                },
                {
                    path: '/shifts',
                    name: 'shifts',
                    component: () => import('@/views/admission/Shifts.vue')
                },
                {
                    path: '/patients',
                    name: 'shifts',
                    component: () => import('@/views/admission/Patients.vue')
                },
                {
                    path: '/users',
                    name: 'users',
                    component: () => import('@/views/admin/Users.vue')
                },
                {
                    path: '/doctors',
                    name: 'doctors',
                    component: () => import('@/views/admin/Doctors.vue')
                },
                {
                    path: '/timetable',
                    name: 'timetable',
                    component: () => import('@/views/admin/Timetable.vue')
                }
            ]
        },
        {
            path: '/',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.sessionUser) {
        // El usuario no está autenticado, redirige a la página de inicio de sesión
        next('/login');
    } else if (to.meta.roles && !authStore.hasRole(to.meta.roles)) {
        // El usuario no tiene el rol requerido para acceder a la ruta
        // Por ejemplo, si la ruta requiere ['administrador', 'medico'] y el usuario es 'admisionista', no tendrá acceso.
        next('/unauthorized');
    } else {
        // El usuario está autenticado y tiene el rol requerido para acceder a la ruta
        next();
    }
});
export default router;
