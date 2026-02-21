import { type NextFunction, type Request, type Response } from "express";

const requireLogin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).send({ error: "You need to login first" });
  }

  next();
};

export default requireLogin;
