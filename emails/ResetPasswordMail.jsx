import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
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
      <Tailwind>
        <Body style={main}>
          <Container style={container}>
            <Section>
              <Text style={text}>Hola {userFirstname},</Text>
              <Text style={text}>
                Recientemente, alguien ha solicitado un cambio de contraseña
                para tu cuenta. Si fuiste tu, puedes cambiar la contraseña desde
                aquí:
              </Text>
              <Section className="text-center mt-[32px] mb-[32px]">
                <Button
                  className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                  href={resetPasswordLink}
                >
                  Restablecer
                </Button>
              </Section>
              <Text style={text}>
                Si no quieres cambiar la contraseña, o no fuiste tu, puedes
                ignorar o eliminar este mensaje.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
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
