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

export const RegisterMail = ({ resetPasswordLink = "#" }) => {
  return (
    <Html>
      <Head />
      <Preview>Registrarse</Preview>
      <Body style={main}>
        <Tailwind>
          <Container style={container}>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[24px] mx-0">
              <strong>Nueva Cuenta</strong>
            </Heading>
            <Section>
              <Text style={text}>Hola,</Text>
              <Text style={text}>
                Invitación para <strong>crearse</strong> una cuenta en nuestro
                sistema desde aquí:
              </Text>
              <Section className="text-center mt-[32px] mb-[32px]">
                <Button
                  className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                  href={resetPasswordLink}
                >
                  Registrarse
                </Button>
              </Section>
              <Text style={text}>
                Si no deseas registrarse, puedes ignorar o eliminar este
                mensaje.
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
        </Tailwind>
      </Body>
    </Html>
  );
};

export default RegisterMail;

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
