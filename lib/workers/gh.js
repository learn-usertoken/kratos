// Generated by IcedCoffeeScript 1.8.0-c
(function() {
  var Promise, add_asset, auth, emptyResolve, get_gh_role, get_gh_team_id, get_gh_team_ids, get_gh_username, gh, git, handle_add_gh_rsrc_role, handle_add_user, handle_create_team, handle_deactivate_user, handle_remove_gh_rsrc_role, handle_remove_repo, handle_remove_user, has_gh_team_membership_through_other_role, teams_api, users, _,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('underscore');

  users = require('../api/users');

  teams_api = require('../api/teams');

  auth = require('../validation/validate').auth;

  git = require('./gh_client');

  Promise = require('pantheon-helpers/lib/promise');

  gh = {};

  emptyResolve = function() {
    return Promise.resolve();
  };

  get_gh_username = function(user) {
    var gh_username, _ref;
    gh_username = (_ref = user.rsrcs.gh) != null ? _ref.username : void 0;
    if (gh_username) {
      return Promise.resolve(gh_username);
    } else {
      return Promise.reject({
        user: user,
        err: 'no github username'
      });
    }
  };

  get_gh_role = function(user, role) {
    var is_contractor, _ref;
    is_contractor = (_ref = user.data) != null ? _ref.contractor : void 0;
    if (is_contractor) {
      return 'push';
    } else {
      return 'admin';
    }
  };

  get_gh_team_id = function(team, user, role) {
    var gh_role, gh_team_id, gh_teams;
    gh_teams = team.rsrcs.gh.data;
    gh_role = get_gh_role(user, role);
    gh_team_id = gh_teams[gh_role];
    return gh_team_id;
  };

  has_gh_team_membership_through_other_role = function(team, user, role) {
    var gh_team_id, other_role, role_data, _ref, _ref1;
    gh_team_id = get_gh_team_id(team, user, role);
    _ref = team.roles;
    for (other_role in _ref) {
      role_data = _ref[other_role];
      if (other_role !== role && (_ref1 = user.name, __indexOf.call(role_data.members, _ref1) >= 0) && get_gh_team_id(team, user, other_role) === gh_team_id) {
        return true;
      }
    }
    return false;
  };

  gh.add_user = function(user, role, team) {
    if (!auth._has_resource_role(user, 'gh', 'user')) {
      return Promise.resolve();
    }
    return get_gh_username(user).then(function(gh_username) {
      var gh_team_id;
      gh_team_id = get_gh_team_id(team, user, role);
      return git.team.user.add(gh_team_id, gh_username).then(emptyResolve);
    });
  };

  gh.remove_user = function(user, role, team) {
    if (has_gh_team_membership_through_other_role(team, user, role)) {
      return Promise.resolve();
    }
    return get_gh_username(user).then(function(gh_username) {
      var gh_team_id;
      gh_team_id = get_gh_team_id(team, user, role);
      return git.team.user.remove(gh_team_id, gh_username).then(emptyResolve);
    });
  };

  handle_add_user = function(event, team) {
    var role, user_id;
    user_id = event.v;
    role = event.k;
    return users.pGet_user(user_id).then(function(user) {
      return gh.add_user(user, role, team);
    });
  };

  handle_remove_user = function(event, team) {
    var role, user_id;
    user_id = event.v;
    role = event.k;
    return users.pGet_user(user_id).then(function(user) {
      return gh.remove_user(user, role, team);
    });
  };

  gh.remove_repo = function(repo_full_name, team) {
    var team_ids, _ref;
    team_ids = _.values(((_ref = team.rsrcs.gh) != null ? _ref.data : void 0) || {});
    return git.teams.repo.remove(team_ids, repo_full_name).then(emptyResolve);
  };

  handle_remove_repo = function(event, team) {
    var repo_full_name;
    repo_full_name = event.r.full_name;
    return gh.remove_repo(repo_full_name, team);
  };

  gh.create_team = function(team_name) {
    var opts;
    opts = [
      {
        name: team_name,
        permission: 'admin'
      }, {
        name: team_name,
        permission: 'push'
      }
    ];
    return git.teams.create(opts).then(function(teams) {
      var out;
      out = {
        admin: teams[0].id,
        push: teams[1].id
      };
      return Promise.resolve(out);
    });
  };

  handle_create_team = function(event, team) {
    return gh.create_team(team.name);
  };

  get_gh_team_ids = function(user) {
    return teams_api.pGetTeamRolesForUser(user).then(function(team_roles) {
      var gh_team_ids;
      gh_team_ids = team_roles.map(function(team_role) {
        return get_gh_team_id(team_role.team, user, team_role.role);
      });
      return Promise.resolve(gh_team_ids);
    });
  };

  handle_add_gh_rsrc_role = function(event, user) {
    return get_gh_username(user).then(function(gh_username) {
      return get_gh_team_ids(user).then(function(gh_team_ids) {
        return git.teams.user.add(gh_team_ids, gh_username);
      });
    }).then(emptyResolve);
  };

  handle_remove_gh_rsrc_role = function(event, user) {
    return get_gh_username(user).then(function(gh_username) {
      return get_gh_team_ids(user).then(function(gh_team_ids) {
        return git.teams.user.remove(gh_team_ids, gh_username);
      });
    }).then(emptyResolve);
  };

  handle_deactivate_user = function(event, user) {
    return get_gh_username(user).then(function(gh_username) {
      return git.user["delete"](gh_username);
    }, function() {
      return Promise.resolve();
    }).then(emptyResolve);
  };

  add_asset = function(repo_name, team) {
    var existing_repo, _ref;
    existing_repo = _.findWhere((_ref = team.rsrcs.gh) != null ? _ref.assets : void 0, {
      'name': repo_name
    });
    if (existing_repo) {
      return Promise.resolve();
    }
    return git.repo.createPush({
      name: repo_name
    }).then(function(new_repo_data) {
      var new_repo, team_ids, _ref1;
      new_repo = {
        gh_id: new_repo_data.id,
        name: new_repo_data.name,
        full_name: new_repo_data.full_name
      };
      team_ids = _.values(((_ref1 = team.rsrcs.gh) != null ? _ref1.data : void 0) || {});
      return git.teams.repo.add(team_ids, new_repo.full_name).then(function() {
        return Promise.resolve(new_repo);
      });
    });
  };

  module.exports = {
    handlers: {
      team: {
        'u+': handle_add_user,
        'u-': handle_remove_user,
        't+': handle_create_team,
        't-': null,
        self: {
          'a+': null,
          'a-': handle_remove_repo
        },
        other: {
          'a+': null,
          'a-': null
        }
      },
      user: {
        self: {
          'r+': handle_add_gh_rsrc_role,
          'r-': handle_remove_gh_rsrc_role
        },
        other: {
          'r+': null,
          'r-': null
        },
        'u+': null,
        'u-': handle_deactivate_user
      }
    },
    add_asset: add_asset,
    testing: gh
  };

}).call(this);
