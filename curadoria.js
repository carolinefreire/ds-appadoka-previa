(() => {
"use strict";
const $ = id => document.getElementById(id);
const repo = "carolinefreire/ds-appadoka-previa";
let items = [], selected = null, focusOrigin = null;
const storageKey = "appadoka-ds-curadoria-notas/v2";
let notes = {};
try {
  const value = JSON.parse(localStorage.getItem(storageKey) || "{}");
  if (value && typeof value === "object" && !Array.isArray(value)) notes = value;
} catch {}
const E = (tag, cls, value) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (value !== undefined) node.textContent = value;
  return node;
};
const isApproved = item => item.status === "aprovado";
const readable = item => isApproved(item) ? "Aprovada" :
  item.status === "reprovado_historico" ? "Rejeitada anteriormente" : "Pendente";
const privateUrl = item => "https://github.com/carolinefreire/ds-appadoka-previa/blob/main/" +
  item.path.split("/").map(encodeURIComponent).join("/");
function closeDialog() {
  if ($("action-dialog").open) $("action-dialog").close();
  focusOrigin?.focus();
}
function setPreview(img, item, fallback) {
  img.alt = item.name;
  img.loading = "lazy";
  img.onerror = () => {
    img.hidden = true;
    fallback.hidden = false;
  };
  if (item.image) {
    img.hidden = false;
    img.src = item.image;
    fallback.hidden = true;
  } else {
    img.removeAttribute("src");
    img.hidden = true;
    fallback.hidden = false;
  }
}
function openDialog(item, origin) {
  selected = item;
  focusOrigin = origin;
  $("dialog-title").textContent = item.name;
  $("dialog-category").textContent = item.category + " · " + readable(item) + " · " + (item.sourcePath||item.path);
  const img = $("dialog-preview"), unavailable = $("private-preview");
  setPreview(img, item, unavailable);
  // This link needs GitHub authorization, since the original repository is private.
  $("private-view").href = privateUrl(item);
  $("dialog-note").value = typeof notes[item.path] === "string" ? notes[item.path] : (item.notes || "");
  $("dialog-help").textContent = "A Issue registra seu pedido, sem alterar arquivos ou decisões.";
  $("action-dialog").showModal();
  $("dialog-close").focus();
}
function issueUrl(item, note) {
  const original = item.path;
  const body = [
    "## Solicitação de ajuste · Design System Appadoka",
    "",
    "**Imagem:** " + item.name,
    "**Arquivo de origem:** `" + (item.sourcePath||original) + "`",
    "**Repositório de origem:** "+(item.sourceRepo||repo),
    "**Arquivo da prévia:** "+original,
    "**Categoria:** " + item.category,
    "**Estado exibido:** " + readable(item),
    "**Prévia pública:** " + (item.image ?
      "https://carolinefreire.github.io/ds-appadoka-previa/" + item.image : "Ainda não disponível"),
    "",
    ...(item.image ? ["### Imagem em avaliação", "", "![" + item.name + "](https://raw.githubusercontent.com/" + repo + "/main/" + item.path.split("/").map(encodeURIComponent).join("/") + ")", ""] : []),
    "### Ajuste ou observação",
    note,
    "",
    "### Imagem de referência (opcional)",
    "Anexe um print ou imagem de referência aqui pelo editor do GitHub.",
    "",
    "> Este registro é uma sugestão pública. Não aprova, exclui nem modifica código ou imagens. A responsável revisará manualmente."
  ].join("\n");
  return "https://github.com/" + repo + "/issues/new?" +
    new URLSearchParams({title:"[Curadoria] Ajuste · " + item.name,body}).toString();
}
$("alter").addEventListener("click", () => {
  if (!selected) return;
  const note = $("dialog-note").value.trim();
  if (!note) {
    $("dialog-help").textContent = "Escreva o ajuste ou observação para abrir a Issue.";
    $("dialog-note").focus();
    return;
  }
  notes[selected.path] = note;
  try { localStorage.setItem(storageKey, JSON.stringify(notes)); } catch {}
  window.open(issueUrl(selected, note), "_blank", "noopener,noreferrer");
  $("dialog-help").textContent = "Issue preparada. Confirme o envio na página do GitHub. Nada é alterado automaticamente.";
});
$("action-dialog").addEventListener("close",()=>focusOrigin?.focus());
$("dialog-close").addEventListener("click", closeDialog);
$("action-dialog").addEventListener("click", event => {
  if (event.target === $("action-dialog")) closeDialog();
});
let decisionItem=null, decisionOrigin=null;
const decisionDialog=$("decision-dialog");
function decisionLink(item,action){
 const title="[Curadoria] "+(action==="approve"?"Aprovar":"Reprovar e solicitar exclusão")+" · "+item.name;
 const body=["## Decisão de curadoria", "", "**Decisão:** "+(action==="approve"?"Aprovar":"Reprovar e excluir o arquivo da prévia"), "**ID:** "+item.id, "**Arquivo:** "+item.path, "**Estado atual:** "+readable(item), "", "Solicitação sujeita à verificação de autorização e referências antes de qualquer alteração."].join("\n");
 return "https://github.com/"+repo+"/issues/new?"+new URLSearchParams({title,body});
}
function openDecision(item,action,origin){
 if(action==="approve"){window.open(decisionLink(item,action),"_blank","noopener,noreferrer");return;}
 decisionItem=item;decisionOrigin=origin;
 $("decision-name").textContent=item.name+" · "+item.path;
 decisionDialog.showModal();$("decision-cancel").focus();
}
$("decision-cancel").addEventListener("click",()=>decisionDialog.close());
$("decision-confirm").addEventListener("click",()=>{if(!decisionItem)return;window.open(decisionLink(decisionItem,"reject"),"_blank","noopener,noreferrer");decisionDialog.close();});
decisionDialog.addEventListener("close",()=>{decisionOrigin?.focus();decisionItem=null;});
function render() {
  const term = $("search").value.trim().toLocaleLowerCase("pt-BR");
  const status = $("filter").value;
  const scope=$("scope").value, category=$("category").value;
  const visible = items.filter(item =>
    (status === "todos" || (item.status === status)) && (scope==="todos" || item.scope===scope) && (category==="todos" || item.category===category) &&
    [item.name,item.category,item.path,item.sourcePath||"",item.notes || "",item.scope].join(" ").toLocaleLowerCase("pt-BR").includes(term)
  );
  const renderable = items.filter(item => Boolean(item.image)).length;
  $("status").textContent = visible.length + " de " + items.length +
    " itens · " + renderable + " com arquivos de prévia publicados · Issues não alteram o repositório";
  const grid = $("admin-gallery");
  grid.replaceChildren();
  if (!visible.length) {
    grid.append(E("p", "", "Nenhum arquivo encontrado."));
    return;
  }
  visible.sort((a,b)=>(["pendente","aprovado","reprovado_historico"].indexOf(a.status)-["pendente","aprovado","reprovado_historico"].indexOf(b.status)) || a.category.localeCompare(b.category,"pt-BR") || a.id.localeCompare(b.id));
  let lastGroup="";
  for (const item of visible) {
    const group=isApproved(item)?"Acervo aprovado":item.status==="reprovado_historico"?"Histórico de reprovações":"Em avaliação";
    if(group!==lastGroup){grid.append(E("h2","curation-group",group));lastGroup=group;}
    const card = E("article","review-card");
    const thumb = E("button","review-thumb");
    thumb.type = "button";
    thumb.setAttribute("aria-label", "Ampliar " + item.name);
    const image = E("img");
    const unavailable = E("div","review-locked","Prévia indisponível");
    thumb.append(image, unavailable);
    setPreview(image,item,unavailable);
    thumb.addEventListener("click",() => openDialog(item,thumb));
    const data = E("div","review-details");
    data.append(E("span","review-label",item.category+" · "+({rodada_atual:"Rodada atual",acervo_oficial:"Acervo oficial",versoes_anteriores:"Versão anterior",referencia_estudo:"Referência / estudo",appadoka_beta:"Appadoka beta"}[item.scope]||"")),E("h2","",item.name),E("p","",item.path));
    data.append(E("span","review-status " + (isApproved(item) ? "is-approved" :
      item.status === "reprovado_historico" ? "is-rejected" : ""), readable(item)));
    if(item.sourcePath) data.append(E("p","","Origem: "+item.sourceRepo+"/"+item.sourcePath));
    if (item.notes) data.append(E("p","",item.notes));
    const open = E("button","review-open",item.image ? "Ampliar e abrir Issue ↗" : "Detalhes e abrir Issue ↗");
    open.type = "button";
    open.addEventListener("click",() => openDialog(item,open));
    data.append(open);
    const actions=E("div","curation-actions");
    const approve=E("button","curation-approve",isApproved(item)?"✓ Aprovado":"✓ Aprovar");
    approve.type="button";approve.disabled=isApproved(item);
    approve.addEventListener("click",()=>openDecision(item,"approve",approve));
    const reject=E("button","curation-reject","✕ Desaprovar");reject.type="button";
    reject.disabled=item.status==="reprovado_historico";
    reject.addEventListener("click",()=>openDecision(item,"reject",reject));
    actions.append(approve,reject);data.append(actions);
    card.append(thumb,data);
    grid.append(card);
  }
}
$("search").addEventListener("input",render);
$("filter").addEventListener("change",render);
$("scope").addEventListener("change",render);
$("category").addEventListener("change",render);
$("export").addEventListener("click", () => {
  const data = {
    schema:"appadoka-ds-curadoria-export/v3",repository:repo,
    exportedAt:new Date().toISOString(),
    statusExplanation:"Exportação consultiva; registros de ajuste são feitos somente por Issues e nunca alteram arquivos automaticamente.",
    items:items.map(item => ({...item,note:typeof notes[item.path] === "string" ? notes[item.path] : ""}))
  };
  const href = URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));
  const anchor = E("a");
  anchor.href = href;
  anchor.download = "appadoka-ds-curadoria.json";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(href),2000);
});
fetch("data/review-catalog.json",{cache:"no-cache"}).then(async response => {
  if (!response.ok) throw Error("HTTP " + response.status);
  return response.json();
}).then(data => {
  if (!Array.isArray(data.items)) throw Error("Catálogo inválido");
  items = data.items;
  for(const c of [...new Set(items.map(i=>i.category))].sort((a,b)=>a.localeCompare(b,"pt-BR"))){const opt=E("option","",c);opt.value=c;$("category").append(opt);}
  $("total").textContent = String(items.length);
  $("aprovados").textContent = String(items.filter(isApproved).length);
  $("pendentes").textContent = String(items.filter(item => !isApproved(item)).length);
  render();
}).catch(() => {
  $("status").textContent = "Não foi possível carregar o catálogo. Acesse o site publicado no GitHub Pages.";
});
})();
