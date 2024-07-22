import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Tailwind,
  Hr,
  Img,
  Heading,
} from "@react-email/components";
import * as React from "react";

export const MatchMail = ({
  data = {
    containerMatch: {
      plateNumber: "123456",
      user: {
        name: "root",
        dni: "123456789",
      },
    },

    serviceOrder: {
      code: "123456",
      booking: "123456",
    },
    name: "ASDF123456-7",
  },
}) => {
  return (
    <Html>
      <Head />
      <Preview>Nuevo Matching {data?.name}</Preview>
      <Tailwind>
        <Body style={main}>
          <Container style={container}>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[24px] mx-0">
              <strong>Nuevo Matching</strong>
            </Heading>

            <Section>
              <Text style={text}>Hola,</Text>
              <Text style={text}>
                Se han registrado el siguiente <strong>matching</strong> de
                contenedor:
              </Text>
              <Section>
                <Row className="font-bold">
                  <Column align="left">OS</Column>
                  <Column align="right">{data?.serviceOrder?.code}</Column>
                </Row>
                <Row className="font-bold">
                  <Column align="left">Booking</Column>
                  <Column align="right">{data?.serviceOrder?.booking}</Column>
                </Row>
                <Row className="font-bold">
                  <Column align="left">Contenedor</Column>
                  <Column align="right">{data?.name}</Column>
                </Row>
                <Row className="font-bold">
                  <Column align="left">Chofer</Column>
                  <Column align="right">
                    {data?.containerMatch?.user?.name}
                  </Column>
                </Row>
                <Row className="font-bold">
                  <Column align="left">DNI</Column>
                  <Column align="right">
                    {data?.containerMatch?.user?.dni}
                  </Column>
                </Row>
                <Row className="font-bold">
                  <Column align="left">Patente</Column>
                  <Column align="right">
                    {data?.containerMatch?.plateNumber}
                  </Column>
                </Row>
              </Section>
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

export default MatchMail;

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
