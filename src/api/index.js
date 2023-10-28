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
export const createPatients = (payload) => axios.post('/users/patients', payload);
export const getUser = (dni) => axios.get(`/users/${dni}`);
export const deleteUser = (dni) => axios.delete(`/users/${dni}`);
export const currentUser = () => axios.get('/users/currentuser');

// COLABORADORES
export const fetchCollaborators = () => axios.get('/collaborators');
export const updateCollaborator = (dni, payload) => axios.put(`/collaborator/${dni}`, payload);
export const createCollaborator = (payload) => axios.post('/collaborator', payload);
export const getCollaborator = (dni) => axios.get(`/collaborator/${dni}`);
export const deleteCollaborator = (dni) => axios.delete(`/collaborator/${dni}`);

// MÉDICOS
export const getInfoDoctors = () => axios.get('/infodoctors');
export const getInfoDoctor = (cmp) => axios.get(`/infodoctors/${cmp}`);
export const getDoctors = () => axios.get('/doctors');
export const updateDoctor = (doctorId, payload) => axios.put(`/doctors/${doctorId}`, payload);
export const updatePersonalizedPrice = (personalizedPriceId, payload) => axios.put(`/doctors/personalizedPrice/${personalizedPriceId}`, payload);
export const getDoctorSchedule = (doctorId) => axios.get(`doctors/${doctorId}/schedule`);
export const createtDoctorSchedule = (payload) => axios.post(`doctors/schedule`, payload);

// DEPENDIENTES
export const getDependents = (userdni) => axios.get(`/users/${userdni}/dependents`);
export const createDependents = (payload) => axios.post('/users/dependents', payload);
export const updateDependent = (dependentId, payload) => axios.put(`/users/dependents/${dependentId}`, payload);
export const deleteDependent = (dependentId) => axios.delete(`/users/dependents/${dependentId}`);

// Citas Medicas
export const createappointment = (payload) => axios.post('/appointment', payload);
export const getAppointmentId = (appointmentId) => axios.get(`/appointment/${appointmentId}`);
export const getAppointmentUserId = (userId) => axios.get(`/appointment/user/${userId}`);

// Pagos
export const createPayment = (payload) => axios.post('/payment', payload);
