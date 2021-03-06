// Generated by IcedCoffeeScript 1.8.0-c
(function() {
  var auth,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  auth = function(validation) {
    validation.auth = auth = {};
    auth.is_system_user = function(user) {
      var _ref;
      return (_ref = user.name) === 'admin';
    };
    auth.is_kratos_system_user = function(user) {
      return user.name === 'admin';
    };
    auth.is_active_user = function(user) {
      return auth.is_system_user(user) || __indexOf.call(user.roles || [], 'kratos|enabled') >= 0;
    };
    auth._has_resource_role = function(user, resource, role) {
      var _ref;
      return auth.is_active_user(user) && (_ref = resource + '|' + role, __indexOf.call(user.roles || [], _ref) >= 0);
    };
    auth._has_team_role = function(user, team, role) {
      var user_id, _ref;
      user_id = user.name;
      return auth.is_active_user(user) && __indexOf.call(((_ref = team.roles[role]) != null ? _ref.members : void 0) || [], user_id) >= 0;
    };
    auth._is_resource_admin = function(user, resource) {
      return auth._has_resource_role(user, resource, 'admin');
    };
    auth._is_team_admin = function(user, team) {
      return auth._has_team_role(user, team, 'admin');
    };
    auth.add_team = function(actor) {
      return auth.kratos._is_kratos_admin(actor);
    };
    auth.remove_team = function(actor) {
      return auth.kratos._is_kratos_admin(actor);
    };
    auth.add_team_asset = function(actor, team, resource) {
      var _ref;
      return auth.is_active_user(actor) && ((_ref = auth[resource]) != null ? typeof _ref.add_team_asset === "function" ? _ref.add_team_asset(actor, team) : void 0 : void 0) || false;
    };
    auth.remove_team_asset = function(actor, team, resource) {
      var _ref;
      return auth.is_active_user(actor) && ((_ref = auth[resource]) != null ? typeof _ref.remove_team_asset === "function" ? _ref.remove_team_asset(actor, team) : void 0 : void 0) || false;
    };
    auth.add_team_member = function(actor, team, role) {
      if (__indexOf.call(auth.roles.team_admin, role) >= 0) {
        return auth.kratos._is_kratos_admin(actor);
      } else if (__indexOf.call(auth.roles.team, role) >= 0) {
        return auth.kratos._is_kratos_admin(actor) || auth._is_team_admin(actor, team);
      } else {
        return false;
      }
    };
    auth.remove_team_member = function(actor, team, role) {
      if (__indexOf.call(auth.roles.team_admin, role) >= 0) {
        return auth.kratos._is_kratos_admin(actor);
      } else {
        return auth.kratos._is_kratos_admin(actor) || auth._is_team_admin(actor, team);
      }
    };
    auth.add_user = function(actor) {
      return auth.kratos._is_kratos_admin(actor);
    };
    auth.remove_user = function(actor) {
      return auth.kratos._is_kratos_admin(actor);
    };
    auth.add_resource_role = function(actor, resource, role) {
      var _ref;
      return auth.is_active_user(actor) && ((_ref = auth[resource]) != null ? typeof _ref.add_resource_role === "function" ? _ref.add_resource_role(actor, role) : void 0 : void 0) || false;
    };
    auth.remove_resource_role = function(actor, resource, role) {
      var _ref;
      return auth.is_active_user(actor) && ((_ref = auth[resource]) != null ? typeof _ref.remove_resource_role === "function" ? _ref.remove_resource_role(actor, role) : void 0 : void 0) || false;
    };
    auth.roles = {
      team: ['admin', 'member'],
      team_admin: ['admin'],
      resource: {
        kratos: ['admin', 'disabled'],
        gh: ['user']
      }
    };
    auth.resources = ['gh'];
    if (typeof window === "undefined" || window === null) {
      require('./kratos')(auth);
      return require('./gh')(auth);
    }
  };

  if (typeof window !== "undefined" && window !== null) {
    auth(window.kratos.validation);
  } else {
    module.exports = auth;
  }

}).call(this);
