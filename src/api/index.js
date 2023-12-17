import axios from './axios';

// ACCESOS
export const sigin = (payload) => axios.post('/access', payload);
export const createAccessUser = (username, payload) => axios.post(`/access/${username}`, payload);
export const fetchAccess = () => axios.get('/access');
export const getAccessUser = (username, payload) => axios.get(`/access/${username}`, payload);
export const updateAccessUser = (username, payload) => axios.put(`/access/${username}`, payload);
export const updateAccessId = (accessId, payload) => axios.put(`/access/accessId/${accessId}`, payload);

// USUARIOS
export const fetchUsers = () => axios.get('/users');
export const updateUser = (dni, payload) => axios.put(`/users/${dni}`, payload);
export const createUser = (payload) => axios.post('/users', payload);
export const getUser = (dni) => axios.get(`/users/${dni}`);
export const deleteUser = (dni) => axios.delete(`/users/${dni}`);
export const currentUser = (dni) => axios.get(`/users/currentuser/${dni}`);
export const urlProfilePhoto = (namePhoto) => axios.get(`/imgusers/photoprofile/${namePhoto}`);

// COLABORADORES
export const fetchCollaborators = () => axios.get('/collaborators');
export const updateCollaborator = (dni, payload) => axios.put(`/collaborator/${dni}`, payload);
export const createCollaborator = (payload) => axios.post('/collaborator', payload);
export const getCollaborator = (dni) => axios.get(`/collaborator/${dni}`);
export const deleteCollaborator = (dni) => axios.delete(`/collaborator/${dni}`);

// MÉDICOS
export const apiGetInfoDoctors = () => axios.get('/infodoctors');
export const apiGetInfoDoctor = (cmp) => axios.get(`/infodoctors/${cmp}`);
export const apiGetDoctors = () => axios.get('/doctors');
export const apiUpdateDoctor = (doctorId, payload) => axios.put(`/doctors/${doctorId}`, payload);
export const apiUpdatePersonalizedPrice = (personalizedPriceId, payload) => axios.put(`/doctors/personalizedPrice/${personalizedPriceId}`, payload);
export const apiGetDoctorSchedule = (doctorId) => axios.get(`doctors/${doctorId}/schedule`);
export const apiCreatetDoctorSchedule = (payload) => axios.post(`doctors/schedule`, payload);

// DEPENDIENTES
export const getDependents = (userdni) => axios.get(`/users/${userdni}/dependents`);
export const createDependents = (payload) => axios.post('/users/dependents', payload);
export const updateDependent = (dependentId, payload) => axios.put(`/users/dependents/${dependentId}`, payload);
export const deleteDependent = (dependentId) => axios.delete(`/users/dependents/${dependentId}`);

// PACIENTES
export const createPatients = (payload) => axios.post('/patients', payload);
export const getPatients = () => axios.get(`/patients`);
export const searchbydni = (dni) => axios.get(`/patients/searchbydni/${dni}`);

// Citas Medicas
export const createappointment = (payload) => axios.post('/appointment', payload);
export const getAppointmentId = (appointmentId) => axios.get(`/appointment/${appointmentId}`);
export const getAppointmentUserId = (userId) => axios.get(`/appointment/user/${userId}`);
export const getAppointmentDoctorId = (doctorId) => axios.get(`/appointment/doctor/${doctorId}`);
export const getAppointment = () => axios.get(`/appointment`);
export const deleteAppointment = (appointmentId) => axios.delete(`/appointment/${appointmentId}`);
export const updateAppointmentId = (appointmentId, payload) => axios.put(`/appointment/${appointmentId}`, payload);
export const updateAppointmentHistory = (appointmentHistoryId, payload) => axios.put(`/appointment/appointmentHistory/${appointmentHistoryId}`, payload);
export const createAppointmentHistory = (payload) => axios.post('/appointment/appointmenthistory', payload);
export const getAppointmentHistoryUserId = (userId) => axios.get(`/appointment/appointmenthistory/${userId}`);

// Caja Registradora
export const getCashRegisters = () => axios.get('/cashregister');
export const getCashRegister = (cashRegisterId) => axios.get(`/cashregister/${cashRegisterId}`);
export const sumIngressAmountByCashRegisterId = (cashRegisterId) => axios.get(`/cashregister/sumIngressAmountByCashRegisterId/${cashRegisterId}`);
export const createCashRegister = (payload) => axios.post('/cashregister', payload);
export const createCashRegisterTransaction = (payload) => axios.post('/cashregister/cashregistertransaction', payload);
export const updateCashRegister = (cashRegisterId, payload) => axios.put(`/cashregister/${cashRegisterId}`, payload);
export const getTodayCashRegisterForAdmissionist = (admissionistId) => axios.get(`/cashregister/todayforadmissionist/${admissionistId}`);
export const getPreviousCashRegisterForAdmissionist = (admissionistId) => axios.get(`/cashregister/previousforadmissionist/${admissionistId}`);
export const getCashRegisterForAdmissionist = (admissionistId) => axios.get(`/cashregister/admissionist/${admissionistId}`);

// Pagos
export const createPayment = (payload) => axios.post('/payment', payload);
export const createPaymentCash = (payload) => axios.post('/payment/cash', payload);
export const getLastPayment = () => axios.get('/payment/lastpayment');

// Qr Whastapp
export const getQrWp = () => axios.get('imgqrwp/urlqr/qr.svg');
