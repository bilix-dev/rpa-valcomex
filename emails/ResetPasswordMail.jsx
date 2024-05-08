import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export const ResetPasswordMail = ({
  userFirstname = "User",
  resetPasswordLink = "#",
}) => {
  return (
    <Html>
      <Head />
      <Preview>Reestablecer contraseña</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={text}>Hola {userFirstname},</Text>
            <Text style={text}>
              Recientemente, alguien ha solicitado un cambio de contraseña para
              tu cuenta. Si fuiste tu, puedes cambiar la contraseña desde aquí:
            </Text>
            <Button style={button} href={resetPasswordLink}>
              Resetear Contraseña
            </Button>
            <Text style={text}>
              Si no quieres cambiar la contraseña, o no fuiste tu, puedes
              ignorar o eliminar este mensaje.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPasswordMail;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center",
  display: "block",
  width: "210px",
  padding: "14px 7px",
};

const anchor = {
  textDecoration: "underline",
};
