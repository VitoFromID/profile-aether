// ========================================
// PROFIL DIRI - Interactive Profile
// Vanilla JS • localStorage persistence
// ========================================

// Default data (sudah diisi sesuai permintaanmu - nama samaran "aether")
let profileData = {
  name: "aether",
  birthdate: "19 Agustus 2011",
  birthplace: "Kudus",
  origin: "Kudus, Jawa Tengah, Indonesia",
  bio: "Seorang enthusiast motor dan web developer yang sedang fokus mengarahkan energi ke hal-hal produktif. Membangun project web interaktif dan self-improvement. Gaspol! 🔥",
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
  waBtn: null
};

// Mode edit sudah dihapus total sesuai permintaan user (read-only)

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

// (Semua fungsi edit mode sudah dihapus total sesuai permintaan user)

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

// Initialize everything (READ-ONLY)
function init() {
  // Cache DOM elements
  els.name = document.getElementById('profile-name');
  els.birthdate = document.getElementById('info-birthdate');
  els.birthplace = document.getElementById('info-birthplace');
  els.origin = document.getElementById('info-origin');
  els.bio = document.getElementById('bio-text');
  els.hobbiesContainer = document.getElementById('hobbies-list');
  els.waBtn = document.getElementById('wa-btn');
  
  // Load saved data
  loadData();
  
  // Initial render
  renderProfile();
  
  // WhatsApp button
  if (els.waBtn) {
    els.waBtn.addEventListener('click', () => {
      const phone = '6283834652308';
      const text = encodeURIComponent('Halo aether! 👋');
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    });
  }
  
  // Easter egg: klik logo untuk reset data
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', () => {
      if (confirm('Reset semua data ke default?')) {
        localStorage.removeItem('profilDiriData');
        location.reload();
      }
    });
  }
  
  console.log('%c[Profil Diri] Read-only mode aktif (edit sudah dihapus total)', 'color:#00f0ff');
}

// ========================================
// STARFIELD BACKGROUND (Ruang Angkasa + Parallax)
// ========================================
let canvas, ctx;
let stars = [];
let scrollSpeed = 0.3; // kecepatan dasar bintang ke atas

function initStarfield() {
  canvas = document.getElementById('starfield');
  if (!canvas) return;
  
  ctx = canvas.getContext('2d', { alpha: true });
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Buat bintang-bintang
  stars = [];
  const starCount = Math.min(220, Math.floor(window.innerWidth * window.innerHeight / 4500));
  
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.2 + 0.6,
      speed: Math.random() * 0.4 + 0.15,
      opacity: Math.random() * 0.7 + 0.3,
      twinkle: Math.random() * 0.03 + 0.01
    });
  }
  
  // Event scroll untuk parallax natural
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    const delta = currentScroll - lastScrollY;
    
    if (delta > 0) {
      // Scroll ke BAWAH → bintang ke ATAS lebih cepat
      scrollSpeed = 0.4 + Math.min(delta * 0.12, 3.5);
    } else {
      // Scroll ke ATAS → bintang sedikit ke BAWAH (efek kamera)
      scrollSpeed = 0.15 + Math.min(Math.abs(delta) * 0.06, 1.2);
    }
    
    lastScrollY = currentScroll;
  });
  
  // Reset speed pelan-pelan ke default
  setInterval(() => {
    scrollSpeed = Math.max(0.25, scrollSpeed * 0.88);
  }, 100);
  
  requestAnimationFrame(animateStars);
}

function animateStars() {
  if (!ctx || !canvas) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let star of stars) {
    // Gerakkan bintang ke atas (parallax)
    star.y -= star.speed * scrollSpeed * 1.6;
    
    // Kalau keluar layar atas, muncul lagi di bawah
    if (star.y < 0) {
      star.y = canvas.height;
      star.x = Math.random() * canvas.width;
    }
    
    // Twinkle effect
    star.opacity += star.twinkle * (Math.random() > 0.5 ? 1 : -1);
    star.opacity = Math.max(0.25, Math.min(1, star.opacity));
    
    // Gambar bintang dengan glow
    ctx.save();
    ctx.globalAlpha = star.opacity;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#a5f3fc';
    ctx.shadowBlur = star.size > 1.8 ? 8 : 3;
    
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Beberapa bintang lebih terang (cross)
    if (star.size > 1.7) {
      ctx.save();
      ctx.globalAlpha = star.opacity * 0.6;
      ctx.strokeStyle = '#bae6fd';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(star.x - star.size * 2.2, star.y);
      ctx.lineTo(star.x + star.size * 2.2, star.y);
      ctx.moveTo(star.x, star.y - star.size * 2.2);
      ctx.lineTo(star.x, star.y + star.size * 2.2);
      ctx.stroke();
      ctx.restore();
    }
  }
  
  requestAnimationFrame(animateStars);
}

// Boot app
document.addEventListener('DOMContentLoaded', () => {
  init();
  initStarfield(); // Jalankan background ruang angkasa
});
