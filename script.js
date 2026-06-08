// ========================================
// PROFIL DIRI - Interactive Profile
// Vanilla JS • localStorage persistence
// ========================================

// Default data (ganti dengan data kamu di sini atau via edit mode)
let profileData = {
  name: "Vito",
  birthdate: "— (isi tanggal lahirmu)",
  birthplace: "— (isi tempat lahirmu)",
  origin: "Semarang, Jawa Tengah, Indonesia",
  bio: "Seorang enthusiast motor dan web developer yang sedang fokus mengarahkan energi ke hal-hal produktif. Sedang dalam proses reboot untuk lebih fokus ke modifikasi motor, membangun project web interaktif, dan self-improvement. Gaspol! 🔥",
  hobbies: [
    "Modifikasi & Maintenance Motor",
    "Web Development (HTML/CSS/JS + Neon Effects)",
    "Membuat Tools & Bot Interaktif",
    "Self Improvement & Digital Detox",
    "Eksplorasi Budaya & Kuliner Lokal"
  ]
};

// DOM Elements
const els = {
  name: null,
  birthdate: null,
  birthplace: null,
  origin: null,
  bio: null,
  hobbiesContainer: null,
  editBtn: null,
  saveBtn: null,
  indicator: null
};

let isEditing = false;
let hobbiesTextarea = null;

// Load from localStorage
function loadData() {
  const saved = localStorage.getItem('profilDiriData');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      profileData = { ...profileData, ...parsed };
    } catch (e) {
      console.warn('Gagal load data dari localStorage');
    }
  }
}

// Save to localStorage
function saveData() {
  localStorage.setItem('profilDiriData', JSON.stringify(profileData));
  showToast('Data berhasil disimpan! ✅');
}

// Render all data to DOM
function renderProfile() {
  // Name
  if (els.name) els.name.textContent = profileData.name;

  // Info rows
  if (els.birthdate) els.birthdate.textContent = profileData.birthdate;
  if (els.birthplace) els.birthplace.textContent = profileData.birthplace;
  if (els.origin) els.origin.textContent = profileData.origin;

  // Bio
  if (els.bio) els.bio.textContent = profileData.bio;

  // Hobbies tags
  renderHobbies();
}

// Render hobby tags
function renderHobbies() {
  if (!els.hobbiesContainer) return;
  
  els.hobbiesContainer.innerHTML = '';
  
  profileData.hobbies.forEach(hobby => {
    const tag = document.createElement('div');
    tag.className = 'hobby-tag';
    tag.textContent = hobby;
    els.hobbiesContainer.appendChild(tag);
  });
}

// Toggle edit mode
function toggleEditMode() {
  isEditing = !isEditing;
  
  const cardContainer = document.querySelector('.cards-grid');
  const hero = document.querySelector('.hero');
  
  if (isEditing) {
    // Enter edit mode
    cardContainer.classList.add('editing');
    hero.classList.add('editing');
    
    // Make fields editable
    makeFieldsEditable();
    
    // Change hobbies to textarea
    switchToHobbiesEdit();
    
    // Update buttons
    els.editBtn.style.display = 'none';
    els.saveBtn.style.display = 'flex';
    els.indicator.classList.add('show');
    
  } else {
    // Exit edit mode + save
    cardContainer.classList.remove('editing');
    hero.classList.remove('editing');
    
    // Collect values from DOM
    collectAndSaveData();
    
    // Re-render hobbies as tags
    renderHobbies();
    
    // Update buttons
    els.editBtn.style.display = 'flex';
    els.saveBtn.style.display = 'none';
    els.indicator.classList.remove('show');
    
    // Save
    saveData();
  }
}

// Make simple fields contenteditable
function makeFieldsEditable() {
  const editableFields = [
    { el: els.name, key: 'name' },
    { el: els.birthdate, key: 'birthdate' },
    { el: els.birthplace, key: 'birthplace' },
    { el: els.origin, key: 'origin' },
    { el: els.bio, key: 'bio' }
  ];
  
  editableFields.forEach(({ el, key }) => {
    if (!el) return;
    
    el.contentEditable = true;
    el.classList.add('editable');
    
    // Auto update on input (debounced)
    let timeout;
    el.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        profileData[key] = el.textContent.trim();
      }, 300);
    });
    
    // Prevent newlines in single line fields
    if (key !== 'bio') {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          el.blur();
        }
      });
    }
  });
}

// Switch hobbies section to editable textarea
function switchToHobbiesEdit() {
  if (!els.hobbiesContainer) return;
  
  // Hide tags container
  els.hobbiesContainer.style.display = 'none';
  
  // Create textarea
  hobbiesTextarea = document.createElement('textarea');
  hobbiesTextarea.className = 'hobbies-edit';
  hobbiesTextarea.value = profileData.hobbies.join('\n');
  hobbiesTextarea.placeholder = 'Satu hobi per baris...';
  
  // Insert after header
  const hobbiesCard = els.hobbiesContainer.parentElement;
  hobbiesCard.appendChild(hobbiesTextarea);
  
  // Focus
  setTimeout(() => hobbiesTextarea.focus(), 50);
}

// Collect data from editable fields + hobbies textarea
function collectAndSaveData() {
  // Simple fields already updated via input listeners
  
  // Bio & others already synced
  
  // Hobbies from textarea
  if (hobbiesTextarea) {
    const lines = hobbiesTextarea.value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (lines.length > 0) {
      profileData.hobbies = lines;
    }
    
    // Remove textarea and show tags again
    hobbiesTextarea.remove();
    hobbiesTextarea = null;
    els.hobbiesContainer.style.display = 'flex';
  }
  
  // Re-render to clean up any formatting
  renderProfile();
}

// Show toast notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%);
    background: #1a1a2e; color: #fff; padding: 12px 24px;
    border-radius: 9999px; font-size: 0.9rem; box-shadow: 0 10px 30px rgb(0 0 0 / 0.3);
    border: 1px solid rgba(0,240,255,0.3); z-index: 300; white-space: nowrap;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

// Initialize everything
function init() {
  // Cache DOM elements
  els.name = document.getElementById('profile-name');
  els.birthdate = document.getElementById('info-birthdate');
  els.birthplace = document.getElementById('info-birthplace');
  els.origin = document.getElementById('info-origin');
  els.bio = document.getElementById('bio-text');
  els.hobbiesContainer = document.getElementById('hobbies-list');
  
  els.editBtn = document.getElementById('edit-btn');
  els.saveBtn = document.getElementById('save-btn');
  els.indicator = document.getElementById('edit-indicator');
  
  // Load saved data
  loadData();
  
  // Initial render
  renderProfile();
  
  // Button listeners
  if (els.editBtn) {
    els.editBtn.addEventListener('click', toggleEditMode);
  }
  
  if (els.saveBtn) {
    els.saveBtn.addEventListener('click', toggleEditMode);
  }
  
  // Keyboard shortcut: press E to toggle edit
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'e' && document.activeElement.tagName === 'BODY') {
      e.preventDefault();
      toggleEditMode();
    }
  });
  
  // Easter egg: click logo to reset data (with confirm)
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', () => {
      if (confirm('Reset semua data ke default?')) {
        localStorage.removeItem('profilDiriData');
        location.reload();
      }
    });
  }
  
  // Initial hint
  console.log('%c[Profil Diri] Tekan tombol Edit atau tekan huruf E di keyboard untuk mode edit', 'color:#00f0ff');
  
  // Welcome toast on first visit (optional)
  if (!localStorage.getItem('profilDiriData')) {
    setTimeout(() => {
      // showToast('Selamat datang! Tekan "Edit Profile" untuk isi data kamu');
    }, 1800);
  }
}

// Boot app
document.addEventListener('DOMContentLoaded', init);