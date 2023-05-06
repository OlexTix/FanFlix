

const sessions = new Map();

const timeoutMiddleware = (req, res, next) => {
  const sessionId = req.sessionId;
  const now = Date.now();

  if (!sessions.has(sessionId) || now - sessions.get(sessionId).lastActive > 15 * 60 * 1000) {
    req.session = {};
    sessions.set(sessionId, { sessionData: req.session, lastActive: now });

    // Delete session data after 15 minutes
    setTimeout(() => {
      sessions.delete(sessionId);
    }, 15 * 60 * 1000);
  } else {
    req.session = sessions.get(sessionId).sessionData;
    sessions.get(sessionId).lastActive = now;
  }

  const clearSession = () => {
    sessions.delete(sessionId);
  };

  res.on("finish", clearSession);
  res.on("close", clearSession);

  next();
};

module.exports = timeoutMiddleware;