export const socketAuthMiddleware = (socket: any, next: any) => {
  try {
    if (socket.request.session?.passport?.user) {
      socket.userId = socket.request.session.passport.user;
      next();
    } else {
      next(new Error("Authentication error"));
    }
  } catch (err) {
    console.error("Socket auth error:", err);
    next(new Error("Authentication failed"));
  }
};
