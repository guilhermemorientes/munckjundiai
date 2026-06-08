# Munck Jundiaí — Site Modernizado

Site institucional para serviços de locação de Munck e Guindauto em Jundiaí-SP.
Versão **HTML/CSS/JS pura** — pronta para subir em qualquer host estático (GitHub Pages, Vercel, Netlify, hospedagem cPanel, etc).

## Estrutura

```
/
├── index.html          → Página principal (Hero, Serviços, FAQ, Contato, Footer)
├── style.css           → Estilos completos (light theme, minimalista)
├── main.js             → Interações: menu, FAQ, form → WhatsApp, scroll reveal
├── 404.html            → Página de erro
├── robots.txt          → SEO
├── manifest.json       → PWA / web app manifest
├── htaccess.txt        → Regras Apache (renomeie para .htaccess no servidor)
├── GoogleScript.txt    → Script Google Apps (não mais usado; mantido como referência)
└── img/
    ├── logo.webp
    ├── background.webp
    ├── compartilhamento.webp
    ├── favicon.ico
    └── fav.ico
```

## Configurações principais

- **WhatsApp**: `5511997667704` em todos os botões e no formulário.
- **Formulário**: ao submeter, abre o WhatsApp com mensagem pré-formatada (Nome, Telefone, E-mail, Cidade, Serviço, Mensagem) — sem backend.
- **Tipografia**: Outfit (headings) + Manrope (corpo) via Google Fonts.
- **Ícones**: Lucide via CDN (`https://unpkg.com/lucide@latest`).
- **SEO**: meta tags, Open Graph, Twitter Card, Schema.org LocalBusiness, GA + Google Ads.

## Como rodar localmente

Qualquer servidor estático:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve

# Live Server (VSCode) também funciona
```

Abra `http://localhost:8080` no navegador.

## Deploy no GitHub Pages

1. Crie um repositório (ex.: `munckjundiai`).
2. Copie todos os arquivos para a raiz do repositório.
3. Configure GitHub Pages → `main` branch / root.
4. Pronto: `https://SEU_USUARIO.github.io/munckjundiai/`.

## Customização rápida

- **Mudar número de WhatsApp**: substitua `5511997667704` em `index.html` e `main.js`.
- **Cores**: edite as variáveis CSS no topo de `style.css` (`--primary`, `--text`, etc).
- **Textos**: edite diretamente em `index.html` (texts dos cards de serviços, FAQ, etc).
