module.exports = function (func) {
  return async function (req, res, next) {
    func(req, res, next).catch(next);
  };
};
