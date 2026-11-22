# Appadoka · Design System (prévia)

Estúdio independente e interativo para revisão do Design System do Appadoka.

## Abrir a prévia no navegador

**[Avaliar os 18 SVGs no GitHub Pages](https://carolinefreire.github.io/ds-appadoka-previa/)**

O endereço acima abre a galeria pública, não o editor do GitHub. A galeria contém botões de aprovar/desaprovar e observações individuais, com opção de exportar um novo JSON. O histórico mais recente foi importado de `avaliacoes/2026-11-22-feedback-revisao-03.json`.

## Estrutura

- `index.html`: estúdio navegável e editável; funciona sem compilação.
- `docs/ORIGEM-E-LIMITES.md`: origem dos elementos, diferenças entre prévia e código real, critérios de migração.

## Identidade e revisão atual

- A revisão 04 está em `assets/brand/ds18-revisao-04/`, composta por 13 candidatos extraídos ou refinados a partir dos SVGs já existentes neste repositório.
- Os itens 07, 08, 09, 17 e 18 permanecem aprovados, sem mudança nos seus arquivos. O 08 recebeu ajuste apenas de exibição na galeria.
- Os itens 10 e 15 foram separados em duas gotinhas e coração, respectivamente. O parecer anterior segue como **reprovado** até a nova avaliação.
- Os outros 11 itens continuam pendentes. As revisões anteriores permanecem no histórico para comparação.
- A prévia não substitui automaticamente os ativos em `carolinefreire/appadoka-beta`.

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
