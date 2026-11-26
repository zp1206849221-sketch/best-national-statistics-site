// Hash router: five pages, one per nav link. #/ overview, #/population, #/economy,
// #/society, #/regions. Renders into <main id="app"> and marks the current nav link.

import { overviewView, populationView, economyView, societyView, regionsView } from './views.js';

const ROUTES = {
  '/': ['overview', overviewView, 'Japan in Numbers — National Statistics'],
  '/population': ['population', populationView, 'Population — Japan in Numbers'],
  '/economy': ['economy', economyView, 'Economy — Japan in Numbers'],
  '/society': ['society', societyView, 'Society — Japan in Numbers'],
  '/regions': ['regions', regionsView, 'Regions & sources — Japan in Numbers'],
};

const app = document.getElementById('app');

function render() {
  const path = location.hash.replace(/^#/, '') || '/';
  const [nav, view, title] = ROUTES[path] ?? ROUTES['/'];
  app.innerHTML = view();
  document.title = title;
  document.querySelectorAll('[data-nav]').forEach(a =>
    a.classList.toggle('active', a.dataset.nav === nav));
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
