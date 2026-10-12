document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 모바일 메뉴 열고 닫기
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');

function setMenu(open) {
  nav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
}

toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

// 스크롤: 헤더 경계선, 진행 막대
const header = document.querySelector('.site-header');
const progress = document.querySelector('.progress');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 8);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.setProperty('--p', max > 0 ? window.scrollY / max : 0);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

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
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el) => observer.observe(el));

  // 현재 보고 있는 섹션을 메뉴에 표시
  const links = [...nav.querySelectorAll('a[href^="#"]:not(.nav-cta)')];
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((a) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) sectionObserver.observe(target);
  });
} else {
  items.forEach((el) => el.classList.add('visible'));
}

// 숫자 카운트업
if (!reduceMotion) {
  document.querySelectorAll('.count').forEach((el, i) => {
    const to = Number(el.dataset.to);
    const duration = 1200;
    const delay = 300 + i * 120;
    el.textContent = '0';
    setTimeout(() => {
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
  });
}

// "이런 일을 맡아요" 문구 순환
const words = document.querySelectorAll('.rotator span');
if (words.length > 1 && !reduceMotion) {
  let index = 0;
  setInterval(() => {
    const current = words[index];
    index = (index + 1) % words.length;
    current.classList.remove('is-active');
    current.classList.add('is-leaving');
    words[index].classList.remove('is-leaving');
    words[index].classList.add('is-active');
    setTimeout(() => current.classList.remove('is-leaving'), 500);
  }, 2200);
}

// 체리 타일 누르면 흔들기
const cherryTile = document.querySelector('.tile-cherry');
cherryTile.addEventListener('click', () => {
  cherryTile.classList.remove('is-bouncing');
  void cherryTile.offsetWidth;
  cherryTile.classList.add('is-bouncing');
});
cherryTile.addEventListener('animationend', (e) => {
  if (e.animationName === 'bounce') cherryTile.classList.remove('is-bouncing');
});

// 이메일 주소 복사
document.querySelectorAll('.copy-btn').forEach((btn) => {
  const label = btn.textContent;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = '복사됐어요!';
    } catch {
      btn.textContent = btn.dataset.copy;
    }
    setTimeout(() => { btn.textContent = label; }, 1800);
  });
});

// 푸터 연도
document.getElementById('year').textContent = new Date().getFullYear();
