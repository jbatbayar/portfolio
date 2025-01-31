import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
// console.log(projects)
const projectsContainer = document.querySelector('.projects');
if (projectsContainer) {
    renderProjects(projects, projectsContainer, 'h2');
} else {
    console.error('Projects container not found');
}

const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`;