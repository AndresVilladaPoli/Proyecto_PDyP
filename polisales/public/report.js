async function loadReport(){
  const res = await fetch('/api/report/xml');
  const xmlText = await res.text();
  document.getElementById('xmlRaw').textContent = xmlText;

  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");

  const totalNode = doc.querySelector('report > total');
  const total = totalNode ? parseFloat(totalNode.textContent) : 0;

  const categories = Array.from(doc.querySelectorAll('report > categories > category'));
  let html = `<table class="styled-table">
      <thead>
        <tr><th>Categoría</th><th>Suma</th><th>% del total</th></tr>
      </thead><tbody>`;

  categories.forEach(cat => {
    const name = cat.getAttribute('name') || 'Sin nombre';
    const sum = parseFloat(cat.querySelector('sum').textContent) || 0;
    const pct = total === 0 ? 0 : (sum / total) * 100;

    html += `
      <tr>
        <td>${escapeHtml(name)}</td>
        <td>${sum.toFixed(2)}</td>
        <td>${pct.toFixed(2)}%</td>
      </tr>`;
  });

  html += `</tbody></table>`;
  html += `<p><strong>Total general:</strong> ${total.toFixed(2)}</p>`;
  document.getElementById('summary').innerHTML = html;

  const treeDiv = document.getElementById('tree');
  const pre = document.createElement('pre');
  pre.textContent = xmlToIndentedString(doc.documentElement, 0);
  treeDiv.appendChild(pre);
}

function xmlToIndentedString(node, depth){
  const indent = '  '.repeat(depth);
  if (node.nodeType === Node.TEXT_NODE) {
    const v = node.nodeValue.trim();
    return v ? indent + v + '\n' : '';
  }
  let s = indent + `<${node.nodeName}`;
  if (node.attributes && node.attributes.length) {
    for (let a of node.attributes)
      s += ` ${a.name}="${a.value}"`;
  }
  s += '>\n';
  for (let c of node.childNodes)
    s += xmlToIndentedString(c, depth+1);
  s += indent + `</${node.nodeName}>\n`;
  return s;
}

function escapeHtml(s){ 
  return (s||'')
    .toString()
    .replace(/[&<>"']/g, c=>(
      { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]
    ));
}

loadReport();
