let data = [];
async function loadData() {
    data = await d3.csv('loc.csv', (row) => ({
      ...row,
      line: Number(row.line), // or just +row.line
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + 'T00:00' + row.timezone),
      datetime: new Date(row.datetime),
    }));
    // console.log(data);
    // processCommits();
    // console.log(commits);
    displayStats();
}
console.log(data);
// let commits = d3.groups(data, (d) => d.commit);
// console.log(commits);
let commits = [];

function processCommits() {
    commits = d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
        let ret = {
          id: commit,
          url: 'https://github.com/jbatbayar/portfolio/commit/' + commit,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length,
        };
  
        Object.defineProperty(ret, 'lines', {
          value: lines,
          configurable: false,
          writable: false,
          enumerable: false
          // What other options do we need to set?
          // Hint: look up configurable, writable, and enumerable
          // Hide from console logs
        });
  
        return ret;
      });
  }


loadData();
createScatterplot();
function displayStats() {
    // Process commits first
    processCommits();
  
    // Create the dl element
    const dl = d3.select('#stats').append('dl').attr('class', 'stats');

    const numfiles = d3.group(data, d => d.file).size;
    const maxdepth = d3.max(data, d => d.depth);
  
    const fileLengths = d3.rollups(
      data,
      (v) => d3.max(v, (v) => v.line),
      (d) => d.file
    );
    const averageFileLength = d3.mean(fileLengths, (d) => d[1]);

    const workByPeriod = d3.rollups(
      data,
      (v) => v.length,
      (d) => new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' })
    );
    // const maxPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];
  
    // Add total commits
    dl.append('dt').text('Total commits');
    dl.append('dd').text(commits.length);

    // Add more stats as needed...
    dl.append('dt').text('Files');
    dl.append('dd').text(numfiles);

    // Add total LOC
    dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
    dl.append('dd').text(data.length);

    dl.append('dt').text('Max depth');
    dl.append('dd').text(maxdepth);

    dl.append('dt').text('Avg file length');
    dl.append('dd').text(averageFileLength);

    // dl.append('dt').text('Period with most work');
    // dl.append('dd').text(maxPeriod);
  }

function createScatterplot(){
const width = 1000;
const height = 600;
const svg = d3
  .select('#chart')
  .append('svg')
  .attr('viewBox', `0 0 ${width} ${height}`)
  .style('overflow', 'visible');


const xScale = d3
  .scaleTime()
  .domain(d3.extent(commits, (d) => d.datetime))
  .range([0, width])
  .nice();
const yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);

const dots = svg.append('g').attr('class', 'dots');

dots
  .selectAll('circle')
  .data(commits)
  .join('circle')
  .attr('cx', (d) => xScale(d.datetime))
  .attr('cy', (d) => yScale(d.hourFrac))
  .attr('r', 5)
  .attr('fill', 'steelblue');

}  
console.log(commits);