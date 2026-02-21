import { type NextFunction, type Request, type Response } from "express";

const requireLogin = (req: Request, res: Response, next: NextFunction) => {
  console.log({
    line: "requireLogin.ts - 5",
    session: req.session,
    headers: req.headers,
    sessionId: req.sessionID,
    sessionStore: req.sessionStore,
  });
  if (!req.user) {
    return res.status(401).send({ error: "You need to login first" });
  }

  next();
};

export default requireLogin;
