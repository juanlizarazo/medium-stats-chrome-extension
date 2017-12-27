/**
 * Represents HTTP unauthorized status code.
 * @type {number}
 */
const HTTP_UNAUTHORIZED = 401;

/**
 * Request stats and passes results to handler function.
 */
function requestStats() {
  const request = new Request('https://medium.com/me/stats?filter=not-response', {
    method: 'GET',
    headers: new Headers({
      accept: 'application/json',
      'Content-Type': 'application/json',
    }),
    credentials: 'include'
  });

  fetch(request)
    .then(response => {
      if (response.status === HTTP_UNAUTHORIZED) {
        chrome.tabs.create({
          url: 'https://medium.com/m/signin'
        });
      }

      return response.text();
    })
    .then(parseResponse);
}

/**
 * Parses response and appends stats to DOM.
 *
 * @param {string} text
 */
function parseResponse(text) {
  const json = JSON.parse(text.replace('])}while(1);</x>', ''));
  const articles = json.payload.value;

  if (articles.length === 0) {
    document.getElementById('header').innerHTML = `<tr>
      <th>Article stats not available.</th>
    </tr>`;
    return;
  }

  document.getElementById('header').innerHTML = `
    <tr>
      <th></th>
      <th>Views</th>
      <th>Reads</th>
      <th>Ratio</th>
    </tr>
  `;

  for (let article of articles) {
    createRow(article.title, article.views, article.reads);
  }
}

/**
 * Creates and appends to DOM stat row.
 *
 * @param {string} title
 * @param {number} views
 * @param {number} reads
 */
function createRow(title, views, reads) {
  const template = `
    <td>${title}</td>
    <td>${views}</td>
    <td>${reads}</td>
    <td>${Math.round(reads * 100 / views)}%</td>
  `;

  const stats = document.createElement('tr');

  stats.innerHTML = template;
  document.getElementById('stats').appendChild(stats);
}
