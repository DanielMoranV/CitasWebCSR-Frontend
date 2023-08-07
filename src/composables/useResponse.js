/* eslint-disable prettier/prettier */
import { useToast } from 'primevue/usetoast';

const toast = useToast();

class useResponse {
    showSuccess = () => {
        toast.add({ severity: 'success', summary: 'Success Message', detail: 'Message Detail', life: 3000 });
    };
    showInfo = () => {
        toast.add({ severity: 'info', summary: 'Info Message', detail: 'Message Detail', life: 3000 });
    };
    showWarn = () => {
        toast.add({ severity: 'warn', summary: 'Warn Message', detail: 'Message Detail', life: 3000 });
    };
    showError = (error) => {
        toast.add({ severity: 'error', summary: 'Error Message', detail: error, life: 3000 });
    };
}
export default useResponse;
