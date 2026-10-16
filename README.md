# Convite · Mavie Lunna, 1 aninho

Convite responsivo da Galinha Pintadinha rosa, com a arte fornecida, carta que abre da direita para a esquerda, lembrança da abertura no navegador, confirmação de presença com acompanhantes e localização no Google Maps.

**Festa:** 28/02/2027, às 19h.

## Publicar no GitHub Pages

O workflow `.github/workflows/pages.yml` publica os arquivos estáticos a cada alteração na `main`. Se o GitHub não permitir a ativação automática, abra **Settings → Pages → Build and deployment → Source: GitHub Actions**, depois execute novamente o workflow em **Actions → Publicar convite no GitHub Pages → Run workflow**.

URL esperada após publicação: https://delta-1.github.io/CONVITE-AC/

Alternativa sem Actions: em Settings → Pages selecione **Deploy from a branch → main → /(root)**. O site não precisa de build.

## Conectar as confirmações ao Google Sheets

A planilha e o aplicativo da Web precisam ser autorizados na conta Google do organizador. O site ainda não tem uma URL do Apps Script configurada: ele informa indisponibilidade e **não simula confirmação**. A carta e o mapa funcionam normalmente.

1. Crie uma planilha no Google Sheets. Mantenha a planilha privada.
2. Abra **Extensões → Apps Script**.
3. Substitua o conteúdo do editor pelo arquivo [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
4. Selecione a função **configurar**, clique **Executar** e autorize o acesso. Isso cria a aba `Confirmacoes` e guarda o ID da planilha nas propriedades privadas do script.
5. Clique **Implantar → Nova implantação → Aplicativo da Web**.
6. Selecione **Executar como: Eu** e **Quem pode acessar: Qualquer pessoa**. Isso libera o recebimento do formulário, sem tornar a planilha pública e sem exigir conta Google dos convidados.
7. Copie a URL que termina em **/exec** e cole no campo `appsScriptUrl` de [`config.js`](config.js). Não use a URL `/dev`.
8. Salve na `main` e aguarde a publicação. Faça uma confirmação de teste e verifique a linha na planilha; depois exclua a linha de teste.

Colunas: ID, data de confirmação, convidado responsável, telefone, nomes dos acompanhantes, total de pessoas e evento. Pedidos repetidos com o mesmo ID são reconhecidos sem duplicar a linha. Campos são validados no servidor e conteúdo iniciado com sinais de fórmula é neutralizado.

Não use `fetch(..., {mode:'no-cors'})`: isso impediria verificar se a gravação funcionou. Se sua organização bloquear acesso anônimo a Apps Script, use uma conta que permita aplicativos públicos ou outro serviço de formulário.

Ao atualizar o código Apps Script, publique uma nova versão em **Implantar → Gerenciar implantações**. As cotas do Google Apps Script continuam aplicáveis.

## Arquivos

- `index.html`, `style.css`, `app.js`: interface e interações, sem dependências de build.
- `config.js`: URL pública do receptor Apps Script e identificador da festa; não contém credenciais.
- `assets/referencia.png`: arte original enviada para o convite.
- `google-apps-script/Code.gs`: receptor validado e gravação na planilha.

A lembrança da abertura e da confirmação vale para o mesmo navegador/dispositivo. Limpar os dados do site ou trocar de aparelho volta a mostrar a carta fechada. Não são gravados nomes ou telefones no armazenamento local; apenas o estado e o ID de envio.

## Verificação

Execute `node --check app.js` e `node --check config.js`. O teste final da gravação depende da implantação do Apps Script e da configuração de sua URL. Os arquivos internos e o código Apps Script são excluídos do artefato do Pages pelo workflow.
