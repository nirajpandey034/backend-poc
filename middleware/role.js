const roles = {
  BASIC: 'basic',
  ADMIN: 'admin',
};

const verifyRole = (req, res, next) => {
  const userRole = req.body.role;

  if (!userRole) return res.json({ error: 'Must pass the  user role' });
  if (userRole === roles.BASIC)
    return res.json({ error: 'Not allowed to perform this operation' });
  return next();
};

module.exports = verifyRole;
