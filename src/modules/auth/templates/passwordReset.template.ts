export const getPasswordResetTemplate = (url: string) => ({
  subject: 'Restablece tu contraseña',
  text: `Ha solicitado restablecer su contraseña. Haga clic en el enlace para restablecer su contraseña: ${url}`,
  html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablece tu contraseña - Olympus GYM</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333333;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td style="padding: 20px 0; text-align: center;">
                <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 30px 30px 20px; text-align: center; background-color: #1a1a1a; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">OLYMPUS <span style="color: #d9303d;">GYM</span></h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="margin: 0 0 20px; color: #333333; font-size: 22px;">Restablece tu contraseña</h2>
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5;">¡Hola!</p>
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Olympus GYM. Para crear una nueva contraseña, haz clic en el botón de abajo:</p>
                            
                            <p style="margin: 30px 0; text-align: center;">
                                <a href="${url}" style="display: inline-block; padding: 12px 30px; background-color: #C52C38; color: #FFFFFF; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 4px; text-transform: uppercase;">Restablecer Contraseña</a>
                            </p>
                            
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5;">Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:</p>
                            <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.5; word-break: break-all; background-color: #f4f4f4; padding: 10px; border-radius: 4px;">${url}</p>
                            
                            
                            <p style="margin: 30px 0 10px; font-size: 16px; line-height: 1.5;">Este enlace expirará en 1 hora por motivos de seguridad.</p>
                            <p style="margin: 0 0 0; font-size: 16px; line-height: 1.5;">Si no solicitaste restablecer tu contraseña, puedes ignorar este correo. Tu cuenta sigue segura.</p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 30px; text-align: center; background-color: #f4f4f4; border-radius: 0 0 8px 8px; color: #666666; font-size: 14px;">
                            <p style="margin: 0 0 10px;">© 2025 Olympus GYM. Todos los derechos reservados.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
});
