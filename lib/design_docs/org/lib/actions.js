// Generated by IcedCoffeeScript 1.8.0-c
(function() {
  var a, do_action, h, validate, validate_doc_update;

  validate = require('./validation/validate');

  do_action = require('./shared/do_action');

  validate_doc_update = require('./shared/validate_doc_update').validate_doc_update;

  h = require('./helpers');

  a = {};

  a.do_actions = {
    team: {
      'u+': function(team, action, actor) {
        var members;
        members = h.mk_objs(team.roles, [action.k, 'members'], []);
        return h.insert_in_place(members, action.v);
      },
      'u-': function(team, action, actor) {
        var members;
        members = h.mk_objs(team.roles, [action.k, 'members'], []);
        return h.remove_in_place(members, action.v);
      },
      'a+': function(team, action, actor) {
        var assets;
        assets = h.mk_objs(team.rsrcs, [action.k, 'assets'], []);
        return h.insert_in_place(assets, action.v);
      },
      'a-': function(team, action, actor) {
        var assets;
        assets = h.mk_objs(team.rsrcs, [action.k, 'assets'], []);
        return h.remove_in_place(assets, action.v);
      }
    }
  };

  a.validate_actions = {
    team: {
      't+': function(event, actor, old_team, new_team) {
        return validate.add_team(actor, new_team);
      },
      'a+': function(event, actor, old_team, new_team) {
        return validate.add_team_asset(actor, old_team, event.k, event.r);
      },
      'a-': function(event, actor, old_team, new_team) {
        return validate.remove_team_asset(actor, old_team, event.k, event.r);
      },
      'u+': function(event, actor, old_team, new_team) {
        return validate.add_team_member(actor, old_team, null, event.k);
      },
      'u-': function(event, actor, old_team, new_team) {
        return validate.remove_team_member(actor, old_team, null, event.k);
      }
    }
  };

  a.do_action = do_action(a.do_actions, validate._get_doc_type, h.add_team_perms);

  a.validate_doc_update = validate_doc_update(a.validate_actions, validate._get_doc_type, validate.auth.is_system_user);

  module.exports = a;

}).call(this);
