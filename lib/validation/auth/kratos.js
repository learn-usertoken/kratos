// Generated by IcedCoffeeScript 1.8.0-c
(function() {
  var kratos;

  kratos = function(auth) {
    return auth.kratos = {
      add_resource_role: function(actor, role) {
        return auth.is_kratos_system_user(actor);
      },
      remove_resource_role: function(actor, role) {
        return auth.is_kratos_system_user(actor);
      },
      _is_kratos_admin: function(actor) {
        return auth._is_resource_admin(actor, 'kratos');
      }
    };
  };

  if (typeof window !== "undefined" && window !== null) {
    kratos(window.kratos.validation.auth);
  } else if (typeof exports !== "undefined" && exports !== null) {
    module.exports = kratos;
  }

}).call(this);
