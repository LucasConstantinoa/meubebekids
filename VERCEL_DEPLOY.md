# Implantação no Vercel

O projeto entrega a vitrine estática pelo Vite e atende as rotas de backend em uma função serverless. Isso mantém **`/admin`**, o catálogo, o registro dos pedidos e os uploads de imagens no mesmo domínio da loja.

## 1. Serviços necessários

| Serviço | Finalidade | Requisito |
|---|---|---|
| MySQL ou TiDB acessível pela internet | Produtos, tamanhos, administradora e pedidos | Obrigatório |
| Bucket S3 compatível ou CDN pública | Fotos enviadas no painel | Obrigatório para upload no Vercel |
| Projeto Vercel | Frontend e rotas `/api/*` | Obrigatório |

## 2. Variáveis de ambiente no Vercel

Cadastre as variáveis em **Settings → Environment Variables** para Production, Preview e Development.

| Variável | Uso |
|---|---|
| `DATABASE_URL` | URL de conexão MySQL/TiDB da loja |
| `JWT_SECRET` | Chave longa e exclusiva que assina a sessão administrativa |
| `ADMIN_LOGIN_EMAIL` | E-mail usado em `/admin` |
| `ADMIN_LOGIN_PASSWORD` | Senha longa e exclusiva usada em `/admin` |
| `S3_BUCKET` | Nome do bucket de fotos |
| `S3_REGION` | Região do bucket, por exemplo `us-east-1` |
| `S3_ACCESS_KEY_ID` | Chave de acesso do bucket |
| `S3_SECRET_ACCESS_KEY` | Segredo do bucket |
| `S3_PUBLIC_BASE_URL` | URL pública/CDN das fotos, sem barra ao final |
| `S3_ENDPOINT` | Opcional; necessário para R2, MinIO ou outro S3 compatível |

> **Segurança:** não exponha nenhuma dessas variáveis no frontend e não use o prefixo `VITE_` para credenciais privadas.

## 3. Publicação

1. Envie o código para um repositório privado no GitHub.
2. Importe o repositório no Vercel.
3. Adicione as variáveis acima e faça o primeiro deploy.
4. Acesse `https://seu-dominio.com/admin`, entre com o e-mail e senha configurados e importe o catálogo atual uma única vez.
5. Depois da importação, cadastre ou edite produtos pelo painel. As imagens carregadas nesse painel passam a usar o bucket externo.

## 4. Operação diária

No painel administrativo você pode cadastrar produtos, escolher tamanhos disponíveis, ocultar itens esgotados, enviar fotos, adicionar links de imagem e guardar o link privado da Shopee. A cliente vê apenas os produtos ativos e os tamanhos disponíveis. Quando ela conclui o pedido, a loja registra nome, telefone, itens e total antes de abrir o WhatsApp.
