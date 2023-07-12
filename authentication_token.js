const jwt = require('./jwt');

module.exports = function authenticateToken(req, res, next)  {
    var authHeader = req.headers['authorization'];

    // TODO
    // authHeader = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjEyM0BnbWFpbC5jb20iLCJpYXQiOjE2ODcyNzUxODgsImV4cCI6MjY4NzI3Njk4OH0.LSMs2er4h9hMXnFECwhw83K8jcMfWZJZYuZmvxTrwq_w2FRyiYl1nph5Vw-t6Hccq9DIPXaQNPR8sI3xLQXdDkXpgMinpN5jT2lipnGdJtxiSDyN4CufB2R6tZ6Qf2R-Qa-ju6rBSBx_AIiw5SeStti_MNdpFRzybdQocke9Z3xgZDv75klfdf2OhpZ2XiLU6BeM65yKIqOYLx161JSuw0NSA4LC-R9PtafJ4J1Rc_jtfYCOD2aiTmH5rAEZ0XNh4CbDed81AtjDAqe2sOxfB2Rv7pjl2O9m0fY-P6U9kCtOdxSl_Z-CBUmzCuGCTmqocShBQBOszuHVaxTHnFau7w";

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.sendStatus(401);
    }
    const token = authHeader.split(' ')[1];
    const legit = jwt.verifyToken(token);
    if (!legit) {
        return res.sendStatus(403);
    }
    req.legit = legit;

    next();
}
