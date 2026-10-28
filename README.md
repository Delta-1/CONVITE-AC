# Convite · Mavie Lunna, 1 aninho

Convite responsivo da Galinha Pintadinha rosa, com a arte fornecida, carta que abre da direita para a esquerda, lembrança da abertura no navegador, confirmação de presença pelo WhatsApp e localização no Google Maps.

**Festa:** 28/02/2027, às 19h.

## Publicar no GitHub Pages

O workflow `.github/workflows/pages.yml` publica os arquivos estáticos a cada alteração na `main`. Se o GitHub não permitir a ativação automática, abra **Settings → Pages → Build and deployment → Source: GitHub Actions**, depois execute novamente o workflow em **Actions → Publicar convite no GitHub Pages → Run workflow**.

URL esperada após publicação: https://delta-1.github.io/CONVITE-AC/

Alternativa sem Actions: em Settings → Pages selecione **Deploy from a branch → main → /(root)**. O site não precisa de build.

## Confirmar presença pelo WhatsApp

A confirmação agora abre a conversa do organizador com uma mensagem pronta. O convidado toca em Enviar no WhatsApp. O site não pede nome, telefone ou acompanhantes e não marca a presença como confirmada apenas porque o link foi aberto.

Defina `whatsappNumber` em `config.js` com código do país + DDD + telefone, somente dígitos. Número configurado: +55 (68) 99929-2317, informado pelo organizador.

A integração anterior com Google Sheets fica desativada. O arquivo `google-apps-script/Code.gs` foi preservado como histórico e não é chamado pelo site.

## Sugestões de presente

Área expansível no convite com roupas de 1 a 2 anos e calçados de 19 a 20.

## Arquivos

- `index.html`, `style.css`, `app.js`: interface e interações, sem dependências de build.
- `config.js`: telefone de destino, mensagem do WhatsApp e identificador da festa.
- `assets/referencia.png`: arte original enviada para o convite.
- `google-apps-script/Code.gs`: receptor validado e gravação na planilha.

A lembrança da abertura vale para o mesmo navegador/dispositivo. Limpar os dados do site ou trocar de aparelho volta a mostrar a carta fechada. Não são gravados nomes ou telefones no armazenamento local; apenas o estado de abertura.

## Verificação

Execute `node --check app.js` e `node --check config.js`. Confira que o botão abre a conversa correta e mantém a mensagem de confirmação pronta para o convidado enviar. Os arquivos internos e o código Apps Script são excluídos do artefato do Pages pelo workflow.

## Cena ilustrada e música

O convite usa a arte original como papel, com os textos sobre a ilustração. A abertura de página revela um zoom suave e três personagens transparentes que surgem ao redor da folha. O arquivo `assets/characters.png` é uma releitura gerada com base na referência enviada, em três células horizontais transparentes.

`musicUrl` em `config.js` aguarda o arquivo de áudio do organizador. Enquanto não houver áudio, nenhum controle de música é exibido. Quando configurado, a música começa no clique de abertura, em volume baixo, com botão para pausar ou tocar. Em visitas com o convite já aberto, o visitante usa o botão de música; não há reprodução audível automática ao carregar a página.
