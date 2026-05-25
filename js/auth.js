'use strict';
/* ============================================================
   auth.js — Sistem autentikasi Lentera Jiwa
   Storage: localStorage
   Key: lj_users (array akun), lj_session (user aktif)
   ============================================================ */

const LJ_AUTH = (function() {

  const KEY_USERS   = 'lj_users';
  const KEY_SESSION = 'lj_session';

  /* ── Helpers ── */
  function getUsers() {
    try { return JSON.parse(localStorage.getItem(KEY_USERS)) || []; } catch(e) { return []; }
  }
  function saveUsers(arr) {
    localStorage.setItem(KEY_USERS, JSON.stringify(arr));
  }

  /* ── Register ── */
  function register(data) {
    // data: { username, nama, email, phone, password, usia, gender, univ, nim, semester }
    var users = getUsers();
    var taken = ['admin','user','test','mahasiswa','root','support','info'];
    var uLower = data.username.toLowerCase();

    if (taken.includes(uLower)) return { ok: false, msg: 'Username tidak tersedia.' };
    if (users.find(function(u){ return u.username.toLowerCase() === uLower; }))
      return { ok: false, msg: 'Username sudah terdaftar.' };
    if (users.find(function(u){ return u.email.toLowerCase() === data.email.toLowerCase(); }))
      return { ok: false, msg: 'Email sudah terdaftar.' };

    var user = {
      id:       'u_' + Date.now(),
      username: data.username,
      nama:     data.nama,
      email:    data.email,
      phone:    data.phone,
      password: data.password,
      usia:     data.usia,
      gender:   data.gender,
      univ:     data.univ,
      nim:      data.nim,
      semester: data.semester,
      role:     'mahasiswa',
      createdAt: new Date().toISOString()
    };

    users.push(user);
    saveUsers(users);
    return { ok: true, user: user };
  }

  /* ── Login ── */
  function login(usernameOrEmail, password) {
    var users = getUsers();
    var found = users.find(function(u) {
      return (u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
              u.email.toLowerCase()    === usernameOrEmail.toLowerCase()) &&
              u.password === password;
    });
    if (!found) return { ok: false, msg: 'Username/email atau kata sandi salah.' };

    var session = {
      id:       found.id,
      username: found.username,
      nama:     found.nama,
      email:    found.email,
      role:     found.role,
      usia:     found.usia,
      gender:   found.gender,
      loginAt:  new Date().toISOString()
    };
    localStorage.setItem(KEY_SESSION, JSON.stringify(session));
    return { ok: true, user: session };
  }

  /* ── Logout ── */
  function logout() {
    localStorage.removeItem(KEY_SESSION);
    window.location.href = 'login.html';
  }

  /* ── Cek session ── */
  function getSession() {
    try { return JSON.parse(localStorage.getItem(KEY_SESSION)) || null; } catch(e) { return null; }
  }

  function isLoggedIn() {
    return getSession() !== null;
  }

  /* ── Guard: redirect ke login kalau belum login ── */
  function requireLogin() {
    if (!isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  /* ── Public API ── */
  return {
    register:     register,
    login:        login,
    logout:       logout,
    getSession:   getSession,
    isLoggedIn:   isLoggedIn,
    requireLogin: requireLogin
  };

})();
