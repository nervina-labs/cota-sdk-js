import { GetCotaReq } from "../types/request";

export const convert = (req: GetCotaReq) => ({
  lockScript: req.lockScript,
  page: req.page.toString(),
  pageSize: req.pageSize.toString(),
})