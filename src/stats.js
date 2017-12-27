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
    .then(response => response.text())
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
    return;
  }

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
    <td>${round(reads * 100 / views, 2)}%</td>
  `;

  const stats = document.createElement('tr');

  stats.innerHTML = template;
  document.getElementById('stats').appendChild(stats);
}

/**
 * Rounds number to given decimal places.
 *
 * @param {number} number
 * @param {number} decimals
 * @return {number}
 */
function round(number, decimals) {
  return Number(Math.round(number + 'e' + decimals) + 'e-' + decimals);
}
