const fs = require('fs');
const html = fs.readFileSync('elementos/estripe/Stripe _ Infraestructura financiera para aumentar tus ingresos.html', 'utf8');
const heroStart = html.indexOf('<section class="hds-color-mode hero-section-container');
const heroEnd = html.indexOf('</section>', heroStart);
const heroHtml = html.substring(heroStart, heroEnd + 10);

const buttonsIdx = heroHtml.indexOf('<div class="hds-button-group hero-section__actions"');
const heroVisual = heroHtml.substring(buttonsIdx + 500, buttonsIdx + 4500); // skip buttons

const formatted = heroVisual.replace(/>/g, '>\n').replace(/</g, '\n<');
console.log(formatted);
