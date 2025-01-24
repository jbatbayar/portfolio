console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
// const navLinks = $$("nav a");
// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname
// );
// currentLink?.classList.add('current');
let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'resume/cv.html', title: 'Resume' },
  { url: 'contact/', title: 'Contact' },
  { url: "https://github.com/jbatbayar", title: "Github Profile"},
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;

  // nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  nav.append(a);

  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }

  if (a.host !== location.host) {
    a.target = "_blank";
  }
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
		</select>
	</label>`
);

const select = document.querySelector('select');

select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  localStorage.colorScheme = event.target.value;
});

if (localStorage.colorScheme) {
  document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
  select.value = localStorage.colorScheme;
} else {
  document.documentElement.style.setProperty('color-scheme', 'light dark');
}

// document.addEventListener('DOMContentLoaded', function() {
//   const form = document.getElementById('contact-form');
//   let url = form.action + "?";

//   form?.addEventListener('submit', function(event) {
//     event.preventDefault();

//     const data = new FormData(form);
//     let url = 'mailto:your-email@example.com?';
//     for (let [name, value] of data) {
//       url += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
//       console.log(name, value);
//     }
//     location.href = url;
//   });
// });
