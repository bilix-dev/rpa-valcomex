import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
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
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[24px] mx-0">
              <strong>Reestablecer Contraseña</strong>
            </Heading>
            <Section>
              <Text style={text}>Hola {userFirstname},</Text>
              <Text style={text}>
                Recientemente, alguien ha solicitado un{" "}
                <strong>cambio de contraseña</strong> para tu cuenta. Si fuiste
                tu, puedes cambiar la contraseña desde aquí:
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
            <Hr />
            <Section className="flex justify-center">
              <Text className="text-md text-slate-500">
                Este correo se generó automáticamente, favor de no responder.
              </Text>
            </Section>

            <Section className="flex justify-center">
              <Img
                src={
                  "https://www.valcomex.cl/wp-content/uploads/2023/04/logo.png"
                }
                alt="Logo"
                width={"200"}
              />
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
