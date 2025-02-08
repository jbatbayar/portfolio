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

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// let arc = arcGenerator({
//     startAngle: 0,
//     endAngle: 2 * Math.PI,
// });
  
// d3.select('svg').append('path').attr('d', arc).attr('fill', 'red');
// let total = 0;

// for (let d of data) {
//   total += d;
// }

// let angle = 0;
// let arcData = [];

// for (let d of data) {
//   let endAngle = angle + (d / total) * 2 * Math.PI;
//   arcData.push({ startAngle: angle, endAngle });
//   angle = endAngle;
// }


// let data = [1, 2];
// let data = [1, 2, 3, 4, 5, 5];
// let data = [
//     { value: 1, label: 'apples' },
//     { value: 2, label: 'oranges' },
//     { value: 3, label: 'mangos' },
//     { value: 4, label: 'pears' },
//     { value: 5, label: 'limes' },
//     { value: 5, label: 'cherries' },
// ];

// let sliceGenerator = d3.pie();
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemeTableau10);


// LAB 5 STEP 3
// let projects = fetchJSON('../lib/projects.json');; // fetch your project data
let rolledData = d3.rollups(
  projects,
  (v) => v.length,
  (d) => d.year,
);

let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

//   END LAB 5 STEP 3

let sliceGenerator = d3.pie().value((d) => d.value);

let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));

// arcs.forEach((arc, idx) => {
//     d3.select('svg')
//       .append('path')
//       .attr('d', arc)
//       .attr('fill', colors(idx)); // Fill in the attribute for fill color via indexing the colors variable
// })

// let legend = d3.select('.legend');
// data.forEach((d, idx) => {
//     legend.append('li')
//           .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
//           .attr('class', 'li_item')
//           .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
// })

// LAB 5 STEP 4.1
let query = '';
let searchInput = document.querySelector('.searchBar');
// searchInput.addEventListener('change', (event) => {
//   // update query value
//   query = event.target.value;
//   // filter projects
//   let filteredProjects = projects.filter((project) => {
//     let values = Object.values(project).join('\n').toLowerCase();
//     return values.includes(query.toLowerCase());
//   });
//   // render filtered projects
//   renderProjects(filteredProjects, projectsContainer, 'h2');
// });

function renderPieChart(projectsGiven) {
  // re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );
  
  // re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  // re-calculate slice generator, arc data, arc, etc.
  let newSliceGenerator = d3.pie().value(d => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));

  // clear up paths and legends
  let newSVG = d3.select('svg'); 
  newSVG.selectAll('path').remove();
  d3.select('.legend').selectAll('li').remove();
  
  // update paths and legends, refer to steps 1.4 and 2.2
    newArcs.forEach((arc, idx) => {
        // d3.select('svg')
        newSVG.append('path')
          .attr('d', arc)
          .attr('fill', colors(idx)); // Fill in the attribute for fill color via indexing the colors variable
    })
    let legend = d3.select('.legend');
    newData.forEach((d, idx) => {
        legend.append('li')
              .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
              .attr('class', 'li_item')
              .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
    })
}

renderPieChart(projects);
// let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('change', (event) => {
    query = event.target.value;
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase())
    ;})
//   let filteredProjects = setQuery(event.target.value);
  // console.log("filtered:", filteredProjects)
  // re-render legends and pie chart when event triggers
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});

let selectedIndex = -1;
let svg = d3.select('svg');
let legend = d3.select('.legend');
  svg.selectAll('path').remove();
  arcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;

        svg
          .selectAll('path')
          .attr('class', (_, idx) => (
            // TODO: filter idx to find correct pie slice and apply CSS from above
            idx === selectedIndex ? 'selected' : ''
          ));
        legend
          .selectAll('li')
          .attr('class', (_, idx) => (
            // TODO: filter idx to find correct legend and apply CSS from above
            idx === selectedIndex ? 'selected' : ''
          ));
          if (selectedIndex === -1) {
            renderProjects(projects, projectsContainer, 'h2');
          } else {
            // TODO: filter projects and project them onto webpage
            // Hint: `.label` might be useful
            let selectedYear = data[selectedIndex].label;
            let selectedProjects = projects.filter((project) => project.year === selectedYear);
            renderProjects(selectedProjects, projectsContainer, 'h2');
          }
      });
});

