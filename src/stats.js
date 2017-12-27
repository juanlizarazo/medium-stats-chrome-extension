request();

function request() {
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
      return response.text();
    })
    .then(text => {
      const json = JSON.parse(text.replace('])}while(1);</x>', ''));
      const articles = json.payload.value;
      if (articles.length > 0) {
        for (let article of articles) {
          createRow(article.title, article.views, article.reads);
        }
      }
    });
}

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

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
