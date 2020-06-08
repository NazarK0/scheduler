const User = require("../components/user/model");
/**
 * This function check user rights 
 * @param {string} user_id - user id(string)
 * @param {string} category - category for checking(string)
 * @return {boolean} boolean lvalue
 */
const hasAccess = async (user_id, category) => {
  const user = await User.findById(user_id).select({ _id: 0, category: 1 });
  return user.category === category;
};

module.exports =hasAccess;
