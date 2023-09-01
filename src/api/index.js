/* eslint-disable prettier/prettier */
import axios from './axios';

// Accesos
/**
 * @url POST /access
 * @since 1.0
 */

export const sigin = (payload) => axios.post('/access', payload);

/**
 * @url POST /access:username
 * @since 1.0
 */
export const createAccessUser = (username, payload) => axios.post(`/access/${username}`, payload);

/**
 * @url GET /access
 * @since 1.0
 */
export const fetchAccess = () => axios.get('/access');

/**
 * @url GET /access:username
 * @since 1.0
 */
export const getAccessUser = (username, payload) => axios.get(`/access/${username}`, payload);

/**
 * @url PUT /access:username
 * @since 1.0
 */
export const updateAccessUser = (username, payload) => axios.put(`/access/${username}`, payload);

// Usuarios
/**
 * @url GET /users
 * @since 1.0
 */
export const fetchUsers = () => axios.get('/users');

/**
 * @url PUT /users/:dni
 * @since 1.0
 */
export const updateUser = (dni, payload) => axios.put(`/users/${dni}`, payload);
/*

/**
 * @url POST /users
 * @since 1.0
 */
export const createUser = (payload) => axios.post('/users', payload);

/**
 * @url POST /users/patients
 * @since 1.0
 */
export const createPatients = (payload) => axios.post('/users/patients', payload);

/**
 * @url GET /users/:id
 * @since 1.0
 */
export const getUser = (dni) => axios.get(`/users/${dni}`);

/**
 * @url DELETE /users/:id
 * @since 1.0
 */
export const deleteUser = (dni) => axios.delete(`/users/${dni}`);

/**
 * @url GET /users/currentuser
 * @since 1.0
 */
export const currentUser = () => axios.get('/users/currentuser');

// Colaboradores

/**
 * @url GET /collaborator
 * @since 1.0
 */
export const fetchCollaborators = () => axios.get('/collaborators');

/**
 * @url PUT /collaborator/:dni
 * @since 1.0
 */
export const updateCollaborator = (dni, payload) => axios.put(`/collaborator/${dni}`, payload);
/*

/**
 * @url POST /collaborator
 * @since 1.0
 */
export const createCollaborator = (payload) => axios.post('/collaborator', payload);

/**
 * @url GET /collaborator/:id
 * @since 1.0
 */
export const getCollaborator = (dni) => axios.get(`/collaborator/${dni}`);

/**
 * @url DELETE /collaborator/:id
 * @since 1.0
 */
export const deleteCollaborator = (dni) => axios.delete(`/collaborator/${dni}`);

// Medicos

/**
 * @url GET /doctors
 * @since 1.0
 */
export const getInfoDoctors = () => axios.get('/infodoctors');

/**
 * @url GET /doctor/:cmp
 * @since 1.0
 */
export const getInfoDoctor = (cmp) => axios.get(`/infodoctors/${cmp}`);
