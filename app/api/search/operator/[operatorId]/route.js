import {
  CntTypes,
  Container,
  Custom,
  Deposit,
  Tatc,
  TransCompany,
  Tstc,
} from "@/database/models";
import { NextResponse } from "next/server";
import qs from "qs";
import { Op } from "sequelize";

export async function GET(request, { params }) {
  const operatorId = params.operatorId;
  const query = qs.parse(request.nextUrl.search, { ignoreQueryPrefix: true });
  const search = query.search;
  const pageSize = parseInt(query.pageSize);

  const tatc = await Tatc.findAll({
    include: [
      { model: Container, where: { operatorId } },
      { model: Custom },
      { model: CntTypes },
      { model: TransCompany },
      { model: Deposit },
      { association: "cancelCustom" },
      { association: "transferOriginDeposit" },
      { association: "transferDestinyDeposit" },
    ],
    where: {
      [Op.or]: {
        tatc: { [Op.like]: "%" + search + "%" },
        "$container.name$": { [Op.like]: "%" + search + "%" },
      },
    },
    order: [["created_at", "DESC"]],
    limit: pageSize,
  });

  const tstc = await Tstc.findAll({
    include: [
      { model: Container, where: { operatorId } },
      { model: Custom },
      { model: CntTypes },
      { model: TransCompany },
      { association: "cancelCustom" },
    ],
    where: {
      [Op.or]: {
        tstc: { [Op.like]: "%" + search + "%" },
        "$container.name$": { [Op.like]: "%" + search + "%" },
      },
    },
    order: [["tstc_issue_date", "DESC"]],
    limit: pageSize,
  });

  const tatcResult = tatc.map((x) => ({
    id: x.id,
    document: x.tatc,
    container: x.container.name,
    type: "T.A.T.C",
    data: x,
  }));

  const tstcResult = tstc.map((x) => ({
    id: x.id,
    document: x.tstc,
    container: x.container.name,
    type: "T.S.T.C",
    data: x,
  }));

  return NextResponse.json([...tatcResult, ...tstcResult]);
}
