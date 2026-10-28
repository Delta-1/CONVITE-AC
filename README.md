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

Área expansível no convite com roupas de 2 a 3 anos e calçados de 20 a 23.

## Arquivos

- `index.html`, `style.css`, `app.js`: interface e interações, sem dependências de build.
- `config.js`: telefone de destino, mensagem do WhatsApp e identificador da festa.
- `assets/referencia.png`: arte original enviada para o convite.
- `google-apps-script/Code.gs`: receptor validado e gravação na planilha.

A lembrança da abertura vale para o mesmo navegador/dispositivo. Limpar os dados do site ou trocar de aparelho volta a mostrar a carta fechada. Não são gravados nomes ou telefones no armazenamento local; apenas o estado de abertura.

## Verificação

Execute `node --check app.js` e `node --check config.js`. Confira que o botão abre a conversa correta e mantém a mensagem de confirmação pronta para o convidado enviar. Os arquivos internos e o código Apps Script são excluídos do artefato do Pages pelo workflow.
