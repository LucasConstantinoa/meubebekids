# Correção do build no Vercel

## Causa confirmada

O log do Vercel mostra que a publicação usa o commit `b306500` do repositório GitHub. Nesse commit, o arquivo obrigatório `client/src/main.tsx` não existe. Por isso, o Vite não consegue resolver a entrada declarada por `client/index.html` e interrompe a compilação.

## Correção necessária

Antes de iniciar um novo deploy, o repositório GitHub conectado ao Vercel precisa conter o código-fonte completo, incluindo:

- `client/src/main.tsx`
- `client/src/App.tsx`
- os demais arquivos em `client/src/`
- `vite.config.ts`
- `package.json` e `pnpm-lock.yaml`

Depois de atualizar o repositório, inicie um novo deploy a partir do commit que inclui esses arquivos. Não é necessário alterar o comando de build para resolver este erro específico.

## Verificação rápida

No GitHub, abra `client/src/main.tsx` na branch `main`. Se o arquivo não abrir, o Vercel continuará falhando até o código-fonte ser enviado ao repositório.
