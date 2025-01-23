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
  { url: "resume/cv.html", title: "Resume" },
  { url: "contact/", title: "Contact" },
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