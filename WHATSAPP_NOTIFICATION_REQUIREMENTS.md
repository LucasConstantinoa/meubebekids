# Notificação de novo pedido por WhatsApp

## Requisito operacional

Quando um pedido for registrado e encaminhado ao WhatsApp pela loja, a administradora deve receber uma notificação automática no WhatsApp com um resumo do pedido.

## Base técnica verificada

A plataforma oficial do WhatsApp Business permite envio programático por sua API de mensagens. Para iniciar mensagens fora da janela de atendimento de 24 horas, ela requer um modelo de mensagem previamente aprovado. A integração precisa de um número comercial registrado, identificador do número comercial e token de acesso mantido apenas no servidor.

Fonte: https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/send-messages

## Dados necessários para ativação

- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- Nome de um modelo de mensagem de utilidade aprovado para o aviso de novo pedido
- Número da administradora que receberá o alerta, em formato internacional

## Segurança

Os segredos permanecem no servidor. O navegador nunca receberá o token de acesso da API.
