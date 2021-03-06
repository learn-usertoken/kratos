// Generated by IcedCoffeeScript 1.8.0-c
(function() {
  var a, do_action, h, validate, validate_doc_update, _;

  validate = require('./validation/validate');

  do_action = require('./shared/do_action');

  validate_doc_update = require('./shared/validate_doc_update').validate_doc_update;

  h = require('./helpers');

  _ = require('./underscore');

  a = {};

  a.do_actions = {
    user: {
      'r+': function(user, action, actor) {
        var role;
        role = action.k + '|' + action.v;
        return h.insert_in_place(user.roles, role);
      },
      'r-': function(user, action, actor) {
        var role;
        role = action.k + '|' + action.v;
        return h.remove_in_place(user.roles, role);
      },
      'u+': function(user, action, actor) {
        return h.insert_in_place(user.roles, 'kratos|enabled');
      },
      'u-': function(user, action, actor) {
        return user.roles = [];
      },
      'd+': function(user, action, actor) {
        var merge_target, path, value;
        path = ['data'].concat(action.k);
        value = action.v;
        if (!_.isObject(value) || _.isArray(value)) {
          throw new Error('value must be an object');
        }
        merge_target = h.mk_objs(user, path, {});
        return _.extend(merge_target, value);
      }
    }
  };

  a.validate_actions = {
    user: {
      'r+': function(event, actor, old_user, new_user) {
        return validate.add_resource_role(actor, new_user, event.k, event.v);
      },
      'r-': function(event, actor, old_user, new_user) {
        return validate.remove_resource_role(actor, new_user, event.k, event.v);
      },
      'u+': function(event, actor, old_user, new_user) {
        return validate.add_user(actor, old_user);
      },
      'u-': function(event, actor, old_user, new_user) {
        return validate.remove_user(actor, user);
      }
    }
  };

  a.do_action = do_action(a.do_actions, validate._get_doc_type, h.sanitize_user);

  a.validate_doc_update = validate_doc_update(a.validate_actions, validate._get_doc_type, validate.auth.is_system_user);

  module.exports = a;

}).call(this);
