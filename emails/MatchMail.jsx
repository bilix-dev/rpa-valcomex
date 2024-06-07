import { toFormatContainer } from "@/helpers/helper";
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
} from "@react-email/components";
import * as React from "react";

export const MatchMail = ({ data }) => {
  return (
    <Html>
      <Head />
      <Preview>Información</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={text}>Hola,</Text>
            <Text style={text}>Se han registrado el siguiente contenedor:</Text>
            <Section>
              <Row>
                <Column>OS</Column>
                <Column>{data.serviceOrder.code}</Column>
              </Row>
              <Row>
                <Column>Booking</Column>
                <Column>{data.serviceOrder.booking}</Column>
              </Row>
              <Row>
                <Column>Contenedor</Column>
                <Column>{toFormatContainer(data.name)}</Column>
              </Row>
              <Row>
                <Column>Chofer</Column>
                <Column>{data.containerMatch.user?.name}</Column>
              </Row>
              <Row>
                <Column>DNI</Column>
                <Column>{data.containerMatch.user?.dni}</Column>
              </Row>
              <Row>
                <Column>Patente</Column>
                <Column>{data.containerMatch.plateNumber}</Column>
              </Row>
            </Section>
          </Section>
        </Container>
      </Body>
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
