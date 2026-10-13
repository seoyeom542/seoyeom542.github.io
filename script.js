document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 스크롤 등장 효과
const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el) => observer.observe(el));
} else {
  items.forEach((el) => el.classList.add('visible'));
}

// 왼쪽 메뉴: 지금 보고 있는 섹션 표시
const navLinks = [...document.querySelectorAll('.side-nav a')];
if (navLinks.length && 'IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-35% 0px -60% 0px' });
  navLinks.forEach((a) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) sectionObserver.observe(target);
  });
}

// 커서를 따라다니는 빛
const spotlight = document.querySelector('.spotlight');
if (spotlight && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
  window.addEventListener('pointermove', (e) => {
    spotlight.style.setProperty('--x', `${e.clientX}px`);
    spotlight.style.setProperty('--y', `${e.clientY}px`);
  }, { passive: true });
}

// 전체 프로젝트: 소속별 보기
const filterBar = document.querySelector('.filters');
if (filterBar) {
  const rows = document.querySelectorAll('.archive tbody tr');
  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter');
    if (!btn) return;
    const key = btn.dataset.filter;
    filterBar.querySelectorAll('.filter').forEach((b) => b.classList.toggle('is-active', b === btn));
    rows.forEach((row) => row.classList.toggle('is-hidden', key !== 'all' && row.dataset.org !== key));
  });
}

// 서울 현재 시각
const clock = document.getElementById('clock');
if (clock) {
  const fmt = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hour12: false });
  const tick = () => { clock.textContent = fmt.format(new Date()); };
  tick();
  setInterval(tick, 15000);
}

// 이력서 PDF로 저장 (인쇄 대화상자 → PDF로 저장)
window.addEventListener('beforeprint', () => items.forEach((el) => el.classList.add('visible')));
document.querySelectorAll('.print-btn').forEach((btn) => btn.addEventListener('click', () => window.print()));

// 푸터 연도
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
