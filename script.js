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

// 전체 프로젝트: 개수 표시와 필터
const works = [...document.querySelectorAll('.work')];
const filterBar = document.querySelector('.filters');
const companyNames = { firm: '법무법인', lawtalk: '로톡', soldoc: '솔닥' };
const countOf = (key) => (key === 'all' ? works.length : works.filter((w) => w.dataset.tags.split(' ').includes(key)).length);

document.querySelector('.count[data-to="works"]').dataset.to = works.length;
document.querySelectorAll('[data-count]').forEach((el) => { el.textContent = countOf(el.dataset.count); });
filterBar.querySelectorAll('.filter').forEach((btn) => {
  btn.insertAdjacentHTML('beforeend', ` <span class="filter-count">${countOf(btn.dataset.filter)}</span>`);
});

function applyFilter(key) {
  // 회사별 필터는 목록에 없는 임시 버튼으로 표시
  filterBar.querySelector('.filter-temp')?.remove();
  if (!filterBar.querySelector(`[data-filter="${key}"]`)) {
    filterBar.firstElementChild.insertAdjacentHTML('afterend',
      `<button class="filter filter-temp" type="button" data-filter="${key}">${companyNames[key]} <span class="filter-count">${countOf(key)}</span> ✕</button>`);
  }
  filterBar.querySelectorAll('.filter').forEach((btn) => btn.classList.toggle('is-active', btn.dataset.filter === key));
  filterBar.scrollLeft = 0;
  works.forEach((w) => {
    const show = key === 'all' || w.dataset.tags.split(' ').includes(key);
    w.classList.toggle('is-hidden', !show);
    w.classList.remove('is-entering');
    if (show && !reduceMotion) {
      void w.offsetWidth;
      w.classList.add('is-entering');
    }
  });
}

filterBar.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter');
  if (!btn) return;
  applyFilter(btn.classList.contains('filter-temp') ? 'all' : btn.dataset.filter);
});

// 경력의 "프로젝트 N건 보기" → 회사별로 걸러서 보여주기
document.querySelectorAll('.tl-link').forEach((link) => {
  link.addEventListener('click', () => applyFilter(link.dataset.filter));
});

// 경력기술서 PDF로 저장 (인쇄 대화상자 → PDF로 저장)
let openedForPrint = [];
window.addEventListener('beforeprint', () => {
  applyFilter('all');
  document.querySelectorAll('.count').forEach((el) => { el.textContent = el.dataset.to; });
  openedForPrint = [...document.querySelectorAll('.case-more:not([open])')];
  openedForPrint.forEach((d) => { d.open = true; });
  items.forEach((el) => el.classList.add('visible'));
});
window.addEventListener('afterprint', () => {
  openedForPrint.forEach((d) => { d.open = false; });
});
document.querySelectorAll('.print-btn').forEach((btn) => btn.addEventListener('click', () => window.print()));

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
