// Generated by IcedCoffeeScript 1.8.0-c
(function() {
  var validation,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  validation = function(validation) {
    var auth;
    auth = validation.auth;
    validation.validation = {
      add_team: function(team) {
        return true;
      },
      remove_team: function(team) {
        return true;
      },
      add_team_asset: function(team, resource, asset) {
        var _ref;
        return ((_ref = validation.validation[resource]) != null ? typeof _ref.add_team_asset === "function" ? _ref.add_team_asset(team, asset) : void 0 : void 0) || false;
      },
      remove_team_asset: function(team, resource, asset) {
        var _ref;
        return ((_ref = validation.validation[resource]) != null ? typeof _ref.remove_team_asset === "function" ? _ref.remove_team_asset(team, asset) : void 0 : void 0) || false;
      },
      add_team_member: function(team, user, role) {
        if (__indexOf.call(auth.roles.team_admin, role) >= 0 || __indexOf.call(auth.roles.team, role) >= 0) {
          return true;
        } else {
          return false;
        }
      },
      remove_team_member: function(team, user, role) {
        return true;
      },
      add_user: function(user) {
        return true;
      },
      remove_user: function(user) {
        return true;
      },
      add_resource_role: function(user, resource, role) {
        return auth.is_active_user(user) && __indexOf.call(auth.roles.resource[resource] || [], role) >= 0;
      },
      remove_resource_role: function(user, resource, role) {
        return true;
      }
    };
    if (typeof window === "undefined" || window === null) {
      return require('./gh')(validation.validation);
    }
  };

  if (typeof window !== "undefined" && window !== null) {
    validation(window.kratos.validation);
  } else {
    module.exports = validation;
  }

}).call(this);
