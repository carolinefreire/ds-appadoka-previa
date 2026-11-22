# Appadoka · Design System (prévia)

Estúdio independente e interativo para revisão do Design System do Appadoka.

## Abrir

- [HTML da prévia](./index.html)
- Para publicar em GitHub Pages: **Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save**.
- Endereço esperado após a ativação do Pages: https://carolinefreire.github.io/ds-appadoka-previa/ (somente quando o GitHub confirmar a publicação).

## Estrutura

- `index.html`: estúdio navegável e editável; funciona sem compilação.
- `docs/ORIGEM-E-LIMITES.md`: origem dos elementos, diferenças entre prévia e código real, critérios de migração.

## Identidade

SVGs referenciados sem alteração a partir de `carolinefreire/appadoka-beta`, branch `feature/cliente-design-visual-test-c01-c29`, pasta `public/brand/oficiais`. O estúdio requer internet para carregar essas imagens. Não são versões locais nem extrações da imagem rasterizada.

## Escopo

- Este repositório é um **ambiente de prévia**; não altera telas do aplicativo.
- O DS legado continua intacto.
- As telas C01–C29 são listadas como inventário, não como screenshots ou cópias fiéis.
- Os componentes interativos são demonstrativos, não componentes React de produção.
- A seleção de dias e horários é demonstrativa, sem consultar disponibilidade real.
- **Produto exclusivo para retirada**: balcão, vaga, ponto fixo, ponto variável; sem delivery em endereço.

## Próximos passos

1. Catalogar integralmente os SVGs oficiais e copiar arquivos aprovados para o DS, com verificação de integridade.
2. Converter componentes aprovados para uma biblioteca React independente, com variantes, estados e testes.
3. Comparar as telas C02–C13 com implementações e mockups aprovados, sem substituição automática.
4. Somente após aprovação, integrar o DS ao aplicativo e marcar o antigo como legado.
