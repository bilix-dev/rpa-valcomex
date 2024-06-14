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
            <Section>
              <Text style={text}>Hola,</Text>
              <Text style={text}>
                Se han registrado el siguiente matching de contenedor:
              </Text>
              <Section>
                <Row>
                  <div style={text} className="flex flex-row justify-between">
                    <div>OS</div>
                    <div>{data?.serviceOrder?.code}</div>
                  </div>
                </Row>
                <Row>
                  <div style={text} className="flex flex-row justify-between">
                    <div>Booking</div>
                    <div>{data?.serviceOrder?.booking}</div>
                  </div>
                </Row>
                <Row>
                  <div style={text} className="flex flex-row justify-between">
                    <div>Contenedor</div>
                    <div>{data?.name}</div>
                  </div>
                </Row>
                <Row>
                  <div style={text} className="flex flex-row justify-between">
                    <div>Chofer</div>
                    <div>{data?.containerMatch?.user?.name}</div>
                  </div>
                </Row>
                <Row>
                  <div style={text} className="flex flex-row justify-between">
                    <div>DNI</div>
                    <div>{data?.containerMatch?.user?.dni}</div>
                  </div>
                </Row>
                <Row>
                  <div style={text} className="flex flex-row justify-between">
                    <div>Patente</div>
                    <div>{data?.containerMatch?.plateNumber}</div>
                  </div>
                </Row>
              </Section>
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
