import 'reveal.js/reset.css';
import 'reveal.js/reveal.css';
import './styles/main.css';
import { initPresentationApp } from './scripts/slides-app.js';

window.addEventListener('DOMContentLoaded', () => {
  initPresentationApp().catch(err => {
    console.error('Failed to initialize presentation:', err);
  });
});
